/* Pour Decisions — app logic. Plain JS, no build step. */
(() => {
  "use strict";

  const PLACES = window.PLACES;
  const DAYS = window.DAYS;
  const TRIP = window.TRIP;
  const byId = Object.fromEntries(PLACES.map((p) => [p.id, p]));
  const $ = (s) => document.querySelector(s);

  // ── Storage (best effort: the app works without it) ──────────────────────
  const store = {
    get(k, fallback) {
      try { const v = localStorage.getItem("pd." + k); return v == null ? fallback : JSON.parse(v); }
      catch { return fallback; }
    },
    set(k, v) { try { localStorage.setItem("pd." + k, JSON.stringify(v)); } catch { /* storage unavailable */ } },
  };

  // ── Time, always in San Francisco ────────────────────────────────────────
  const WD = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const sfParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles", year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  });
  // ?now=2026-10-31T10:30 pins the clock to a San Francisco time, for previewing a trip day.
  const nowParam = new URLSearchParams(location.search).get("now");

  function sfNow() {
    if (nowParam && /^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(nowParam)) {
      const [date, t] = nowParam.split("T");
      const [h, m] = t.split(":").map(Number);
      return { date, mins: h * 60 + m, pinned: true };
    }
    const p = Object.fromEntries(sfParts.formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { date: `${p.year}-${p.month}-${p.day}`, mins: (+p.hour % 24) * 60 + +p.minute };
  }
  const wdOf = (date) => WD[new Date(date + "T12:00:00Z").getUTCDay()];
  const dayLabel = (date) => new Date(date + "T12:00:00Z").toLocaleDateString("en-GB",
    { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

  function fmtTime(mins) {
    let h = Math.floor(mins / 60) % 24; const m = mins % 60;
    const ap = h >= 12 ? "pm" : "am"; h = h % 12 || 12;
    return m ? `${h}:${String(m).padStart(2, "0")}${ap}` : `${h}${ap}`;
  }
  const toMins = (s) => { const [h, m] = s.split(":").map(Number); return h * 60 + m; };

  // ── Hours ────────────────────────────────────────────────────────────────
  function specFor(p, date) {
    if (p.dates && p.dates[date]) return p.dates[date];
    return (p.hours && p.hours[wdOf(date)]) || null;
  }
  function ranges(spec) {
    if (!spec || spec === "closed") return [];
    return spec.split(",").map((r) => {
      const [o, c] = r.split("-");
      return { o: o === "?" ? null : toMins(o), c: toMins(c) };
    });
  }
  // Hours for a whole day, e.g. "7am–6pm". cls: "" | "closed" | "unk".
  function hoursText(p, date) {
    const spec = specFor(p, date);
    if (!spec) return { text: "Not listed", cls: "unk" };
    if (spec === "closed") return { text: "Closed", cls: "closed" };
    return {
      text: ranges(spec).map((r) => (r.o == null ? `Until ${fmtTime(r.c)}` : `${fmtTime(r.o)}–${fmtTime(r.c)}`)).join(", "),
      cls: "",
    };
  }
  // Status right now. Unknown hours return text "" so lists stay quiet.
  function status(p, now) {
    const spec = specFor(p, now.date);
    if (!spec) return { cls: "unknown", text: "" };
    if (spec === "closed") return { cls: "closed", text: "Closed today" };
    const m = now.mins;
    for (const r of ranges(spec)) {
      if ((r.o == null || m >= r.o) && m < r.c) {
        const left = r.c - m;
        if (left <= 45) return { cls: "soon", text: `Closes in ${left} min`, open: true };
        return { cls: "open", text: `Open until ${fmtTime(r.c)}`, open: true };
      }
      if (r.o != null && m < r.o) return { cls: "later", text: `Opens ${fmtTime(r.o)}` };
    }
    return { cls: "closed", text: "Closed now" };
  }
  // Status for a plan day that isn't today: just that day's hours.
  function dayStatus(p, date) {
    const h = hoursText(p, date);
    if (h.cls === "unk") return { cls: "unknown", text: "" };
    if (h.cls === "closed") return { cls: "closed", text: "Closed this day" };
    return { cls: "later", text: h.text };
  }

  // ── Distance ─────────────────────────────────────────────────────────────
  function meters(a, b) {
    const R = 6371000, t = Math.PI / 180;
    const x = (b.lng - a.lng) * t * Math.cos(((a.lat + b.lat) / 2) * t);
    const y = (b.lat - a.lat) * t;
    return R * Math.hypot(x, y);
  }
  // Straight-line distance stretched for the street grid, at an easy 80 m a minute.
  const walkMins = (m) => Math.max(1, Math.round((m * 1.3) / 80));
  function walkText(mins) {
    if (mins < 60) return `${mins} min`;
    const h = Math.floor(mins / 60), r = mins % 60;
    return `${h} hr${r >= 10 ? ` ${r}` : ""}`;
  }

  // ── State ────────────────────────────────────────────────────────────────
  const visited = store.get("visited", {}); // id -> ISO timestamp
  const saved = store.get("ui2", {});
  const now0 = sfNow();
  const tripDay = DAYS.find((d) => d.date === now0.date);
  const state = {
    tab: ["explore", "plan", "been"].includes(saved.tab) ? saved.tab : "explore",
    kinds: new Set(saved.kinds || []), // empty = everything
    q: "",
    sel: null,
    day: tripDay ? tripDay.date : (now0.date > TRIP.end ? DAYS[DAYS.length - 1].date : DAYS[0].date),
    me: null,
    mapBig: false,
  };
  // One-shot animation cues, consumed by the next render. Renders also happen on a timer
  // and on location updates, and those must not replay animations.
  const fx = { list: true, tick: null };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Restart a CSS animation on an element that stays in the DOM.
  const replay = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  // Stagger the first rows of a freshly rendered list.
  function enterRows(listEl) {
    if (!fx.list) return;
    [...listEl.children].slice(0, 12).forEach((li, i) => { li.style.setProperty("--n", i); li.classList.add("enter"); });
  }

  const saveUi = () => store.set("ui2", { tab: state.tab, kinds: [...state.kinds] });

  const SF_CENTER = { lat: 37.7749, lng: -122.4194 };
  const inSF = () => state.me && meters(state.me, SF_CENTER) < 30000;
  const origin = () => (inSF() ? state.me : TRIP.base);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fold = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const KIND = {
    coffee: { label: "Coffee", icon: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8.5 3.5v3M12.5 3.5v3"/>' },
    food: { label: "Eat", icon: '<path d="M7 3v18M4.5 3v5a2.5 2.5 0 0 0 5 0V3"/><path d="M17 21V3c-2.2 1.6-3.3 4.2-3.3 7.5V14H17"/>' },
    drinks: { label: "Drink", icon: '<path d="M4.5 4h15L12 12.5z"/><path d="M12 12.5V20M8 20h8"/>' },
  };
  const gmapsSearch = (p) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.q);
  const gmapsWalk = (p) => "https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=" + encodeURIComponent(p.q);
  const checkSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 12.5 4 4L18.5 8"/></svg>';
  const walkSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-6.5L14 17v4M7 12.5l2.5-4.5 4 1.5 2.5 3.5M11.5 14.5 13 9"/></svg>';
  const mapSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/></svg>';

  function matches(p) {
    if (state.kinds.size && !state.kinds.has(p.kind)) return false;
    if (state.q) {
      const hay = fold([p.name, p.area, p.blurb, p.order, p.addr].join(" "));
      if (!fold(state.q).split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }

  // The one list row used on every tab.
  function rowHtml(p, st, sub) {
    const v = !!visited[p.id];
    const mins = walkMins(meters(origin(), p));
    const bits = [esc(sub ?? p.area)];
    if (st && st.text) bits.push(`<span class="st st-${st.cls}">${esc(st.text)}</span>`);
    return `<li class="row k-${p.kind}${v ? " is-visited" : ""}${state.sel === p.id ? " is-sel" : ""}${fx.tick === p.id ? " pop" : ""}" data-id="${p.id}">
      <button type="button" class="row-main" data-open="${p.id}">
        <span class="row-top"><i class="dot"></i><span class="row-name">${esc(p.name)}</span><span class="row-walk">${walkText(mins)}</span></span>
        <span class="row-sub">${bits.join(" · ")}</span>
      </button>
      <button type="button" class="check" data-visit="${p.id}" aria-pressed="${v}" aria-label="${v ? "Been here. Tap to undo" : "Mark as been"}: ${esc(p.name)}"><i>${checkSvg}</i></button>
    </li>`;
  }

  // ── Header clock ─────────────────────────────────────────────────────────
  function renderClock(now) {
    $("#clock").textContent = `${dayLabel(now.date)} · ${fmtTime(now.mins)}${now.pinned ? " (preview)" : ""}`;
  }

  // ── Nearby ───────────────────────────────────────────────────────────────
  function renderExplore(now) {
    document.querySelectorAll(".kinds .chip").forEach((b) => b.setAttribute("aria-pressed", String(state.kinds.has(b.dataset.kind))));
    const o = origin();
    const list = PLACES.filter(matches).map((p) => ({ p, d: meters(o, p) })).sort((a, b) => a.d - b.d);
    $("#list").innerHTML = list.map(({ p }) => rowHtml(p, status(p, now))).join("");
    enterRows($("#list"));
    $("#list-empty").hidden = list.length > 0;

    const hint = $("#lochint");
    if (inSF()) hint.hidden = true;
    else {
      hint.hidden = false;
      hint.innerHTML = state.me
        ? "You're not in SF yet, so walking times are from SoMa."
        : 'Walking times from SoMa. <button type="button" class="link" id="btn-locprompt">Use my location</button>';
    }
  }

  // ── Plan ─────────────────────────────────────────────────────────────────
  function renderPlan(now) {
    const daysEl = $("#days");
    if (!daysEl.children.length) {
      daysEl.innerHTML = DAYS.map((d) => `<button type="button" class="day" role="tab" data-day="${d.date}">${esc(d.label.replace(/ (Oct|Nov)$/, ""))}</button>`).join("")
        + '<span class="days-ink" aria-hidden="true"></span>';
    }
    daysEl.querySelectorAll(".day").forEach((b) => {
      b.setAttribute("aria-selected", String(b.dataset.day === state.day));
      b.classList.toggle("is-today", b.dataset.day === now.date);
    });
    daysEl.style.setProperty("--i", DAYS.findIndex((x) => x.date === state.day));

    const d = DAYS.find((x) => x.date === state.day);
    const isToday = d.date === now.date;
    const ids = d.steps.flatMap((s) => s.places || []);
    const done = ids.filter((id) => visited[id]).length;
    const row = (id) => rowHtml(byId[id], isToday ? status(byId[id], now) : dayStatus(byId[id], d.date));

    $("#dayplan").innerHTML = `
      <div class="plan-head">
        <h2>${esc(d.title)}</h2>
        <p>${esc(dayLabel(d.date))}${isToday ? " · today" : ""} · ${done} of ${ids.length} done</p>
      </div>
      <div class="watch"><ul>${d.watch.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></div>
      ${d.steps.map((s) => `
        <div class="step">
          <div class="step-k">${esc(s.k)}</div>
          ${s.text ? `<p class="step-text">${esc(s.text)}</p>` : ""}
          ${(s.places || []).length ? `<ol class="list">${s.places.map(row).join("")}</ol>` : ""}
        </div>`).join("")}`;
    if (fx.list) replay($("#dayplan"), "enter");
  }

  // ── Been ─────────────────────────────────────────────────────────────────
  let confirmClear = false;
  function renderBeen(now) {
    const ids = Object.keys(visited).filter((id) => byId[id]);
    const countEl = $("#been-count");
    if (ids.length > (+countEl.textContent || 0)) replay(countEl, "bump");
    countEl.textContent = ids.length ? ids.length : "";
    if (state.tab !== "been") return;
    const n = (k) => ids.filter((id) => byId[id].kind === k).length;
    const when = (iso) => new Date(iso).toLocaleString("en-GB", {
      timeZone: "America/Los_Angeles", weekday: "short", hour: "numeric", minute: "2-digit", hour12: true,
    }).replace(/ (am|pm)/, "$1");
    const sorted = ids.sort((a, b) => visited[b].localeCompare(visited[a]));

    $("#been").innerHTML = ids.length ? `
      <div class="tally">
        <strong>${ids.length} ${ids.length === 1 ? "place" : "places"}</strong>
        <span>${Object.entries(KIND).map(([k, v]) => `<b class="k-${k}"><i class="dot"></i>${n(k)} ${v.label.toLowerCase()}</b>`).join("")}</span>
      </div>
      <ol class="list" id="been-list">${sorted.map((id) => rowHtml(byId[id], null, `${byId[id].area} · ${when(visited[id])}`)).join("")}</ol>
      <div class="been-tools">
        <button type="button" class="link" id="btn-copy">Copy list</button>
        ${confirmClear
          ? `<span>Untick all ${ids.length}? <button type="button" class="link" id="btn-clear-yes">Yes, untick</button> · <button type="button" class="link quiet" id="btn-clear-no">Keep</button></span>`
          : `<button type="button" class="link quiet" id="btn-clear">Untick all</button>`}
      </div>`
      : `<p class="empty">Nothing ticked yet. Tap the circle next to a place once you've been.</p>`;
    if ($("#been-list")) enterRows($("#been-list"));
  }

  // ── Sheet (place details) ────────────────────────────────────────────────
  let sheetId = null;
  function renderSheet(now) {
    if (!sheetId) return;
    const p = byId[sheetId];
    const st = status(p, now);
    const v = !!visited[p.id];
    const mins = walkMins(meters(origin(), p));
    const notes = [];
    if (p.warn) notes.push(p.warn);
    if (p.dateWarn && p.dateWarn[now.date]) notes.push(p.dateWarn[now.date]);
    if (p.hoursNote) notes.push(p.hoursNote);
    const tags = [p.book && "Book ahead", ...(p.tags || []).filter((t) => !/^book|reservations/i.test(t))].filter(Boolean);
    const anyHours = DAYS.some((d) => specFor(p, d.date));

    $("#sheet").className = `sheet k-${p.kind}`;
    $("#sheet-body").innerHTML = `
      <div>
        <h2 class="d-name" id="sheet-title">${esc(p.name)}</h2>
        <div class="d-meta"><i class="dot"></i>${KIND[p.kind].label} · ${esc(p.area)}${p.price ? ` · ${esc(p.price)}` : ""} · ${walkText(mins)} walk${inSF() ? "" : " from SoMa"}</div>
        ${st.text ? `<div class="d-meta"><span class="st st-${st.cls}">${esc(st.text)}</span></div>` : ""}
      </div>
      ${notes.map((n) => `<div class="note">${esc(n)}</div>`).join("")}
      ${p.blurb ? `<p class="d-blurb">${esc(p.blurb)}</p>` : ""}
      ${p.order ? `<div class="d-sec"><h3>Order</h3><p>${esc(p.order)}</p></div>` : ""}
      ${tags.length ? `<p class="tags">${tags.map(esc).join(" · ")}</p>` : ""}
      <div class="d-sec"><h3>Hours</h3>
        ${anyHours ? `<table class="hours"><tbody>${DAYS.map((d) => {
          const h = hoursText(p, d.date);
          return `<tr class="${d.date === now.date ? "today" : ""}"><td>${dayLabel(d.date)}</td><td class="${h.cls}">${esc(h.text)}</td></tr>`;
        }).join("")}</tbody></table>` : `<p class="tags">Not listed. Check Google Maps before you go.</p>`}
      </div>
      <div class="d-sec"><h3>Address</h3>
        <p class="addr">${esc(p.addr || p.area)}${p.approx ? " <small>· pin marks the neighbourhood</small>" : ""}</p>
      </div>`;
    $("#sheet-actions").innerHTML = `
      <a class="btn primary" href="${gmapsWalk(p)}" target="_blank" rel="noopener">${walkSvg}Walk</a>
      <a class="btn" href="${gmapsSearch(p)}" target="_blank" rel="noopener">${mapSvg}Maps</a>
      <button type="button" class="btn${v ? " done" : ""}" data-visit="${p.id}" aria-pressed="${v}">${checkSvg}Been here</button>`;
  }
  let lastFocus = null, closeTimer = null;
  function openSheet(id) {
    clearTimeout(closeTimer);
    $("#sheet").classList.remove("is-closing"); $("#scrim").classList.remove("is-closing");
    $("#sheet").style.transform = ""; $("#sheet").style.transition = "";
    sheetId = id;
    lastFocus = document.activeElement;
    select(id, { pan: true });
    $("#peek").hidden = true;
    $("#scrim").hidden = false;
    $("#sheet").hidden = false;
    renderSheet(sfNow());
    $("#sheet-body").scrollTop = 0;
    $("#sheet-close").focus({ preventScroll: true });
  }
  function closeSheet() {
    if (!sheetId) return;
    sheetId = null;
    const sheet = $("#sheet"), scrim = $("#scrim");
    sheet.classList.add("is-closing"); scrim.classList.add("is-closing");
    closeTimer = setTimeout(() => {
      sheet.hidden = true; scrim.hidden = true;
      sheet.classList.remove("is-closing"); scrim.classList.remove("is-closing");
      sheet.style.transform = ""; sheet.style.transition = "";
    }, reducedMotion ? 0 : 200);
    renderPeek(sfNow());
    if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
  }

  // ── Peek (pin tapped on the map) ─────────────────────────────────────────
  let peekFor = null;
  function renderPeek(now) {
    const el = $("#peek");
    if (!state.sel || sheetId) { el.hidden = true; peekFor = null; return; }
    const p = byId[state.sel];
    const st = status(p, now);
    const sub = [esc(p.area)];
    if (st.text) sub.push(`<span class="st st-${st.cls}">${esc(st.text)}</span>`);
    el.className = `peek k-${p.kind}`;
    el.innerHTML = `
      <button type="button" class="row-main" data-open="${p.id}">
        <span class="row-top"><i class="dot"></i><span class="row-name">${esc(p.name)}</span></span>
        <span class="row-sub">${walkText(walkMins(meters(origin(), p)))} · ${sub.join(" · ")}</span>
      </button>
      <a class="btn primary small" href="${gmapsWalk(p)}" target="_blank" rel="noopener" aria-label="Walk to ${esc(p.name)} in Google Maps">${walkSvg}Walk</a>`;
    el.hidden = false;
    if (peekFor !== state.sel) { peekFor = state.sel; replay(el, "enter"); }
  }

  // ── Map ──────────────────────────────────────────────────────────────────
  // OpenFreeMap vector tiles drawn by MapLibre: free, no key. The style's colours are
  // replaced with the --map-* design tokens, so the map follows the app's palette and theme.
  // (MapLibre zoom levels sit one below the old raster ones: 14.5 here is a few blocks across.)
  const map = new maplibregl.Map({
    container: "map",
    style: "https://tiles.openfreemap.org/styles/positron",
    center: [-122.43, 37.775], zoom: 12,
    attributionControl: { compact: true },
    dragRotate: false, pitchWithRotate: false, maxPitch: 0,
  });
  map.touchZoomRotate.disableRotation();
  const anim = (ms) => (reducedMotion ? 0 : ms);

  function applyMapTheme() {
    const css = getComputedStyle(document.documentElement);
    const t = (n) => css.getPropertyValue(n).trim();
    const paint = (ids, prop, v) => ids.forEach((id) => { if (map.getLayer(id)) map.setPaintProperty(id, prop, v); });
    paint(["background"], "background-color", t("--map-land"));
    paint(["landuse_residential"], "fill-color", t("--map-land"));
    paint(["water"], "fill-color", t("--map-water"));
    paint(["waterway"], "line-color", t("--map-water"));
    paint(["park", "landcover_wood"], "fill-color", t("--map-park"));
    paint(["building"], "fill-color", t("--map-building"));
    paint(["building"], "fill-outline-color", t("--map-building-line"));
    paint(["road_area_pier"], "fill-color", t("--map-road"));
    paint(["highway_path", "highway_minor", "road_pier"], "line-color", t("--map-road"));
    paint(["highway_major_inner", "highway_major_subtle", "highway_motorway_inner", "highway_motorway_subtle",
      "highway_motorway_bridge_inner", "tunnel_motorway_inner"], "line-color", t("--map-road-major"));
    paint(["highway_major_casing", "highway_motorway_casing", "highway_motorway_bridge_casing", "tunnel_motorway_casing"],
      "line-color", t("--map-road-casing"));
    paint(["railway", "railway_dashline", "railway_transit", "railway_transit_dashline", "railway_service", "railway_service_dashline"],
      "line-color", t("--map-rail"));
    for (const l of map.getStyle().layers) {
      if (l.type !== "symbol") continue;
      const water = /water/.test(l.id);
      map.setPaintProperty(l.id, "text-color", t(water ? "--map-water-label" : "--map-label"));
      map.setPaintProperty(l.id, "text-halo-color", t(water ? "--map-water" : "--map-land"));
    }
    if (map.getLayer("me-acc")) {
      map.setPaintProperty("me-acc", "circle-color", t("--accent"));
      map.setPaintProperty("me-acc", "circle-stroke-color", t("--accent"));
    }
  }
  map.on("load", () => {
    // We know which city we're in: drop the big place names that sit on top of the pins.
    for (const l of map.getStyle().layers) {
      if (/^label_(city|state|country)/.test(l.id)) map.setLayoutProperty(l.id, "visibility", "none");
    }
    // Keep the map credit folded into its ⓘ button.
    document.querySelector(".maplibregl-ctrl-attrib")?.classList.remove("maplibregl-compact-show");
    applyMapTheme();
    if (state.me) drawAccuracy();
  });
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener?.("change", () => { if (map.isStyleLoaded()) applyMapTheme(); });

  // Small, glyph-free pins when the whole city is in view.
  const zoomClass = () => $("#map").classList.toggle("zoomed-out", map.getZoom() < 13);
  map.on("zoom", zoomClass);

  // A DOM element pinned to a spot on the map.
  const pinAt = (lng, lat, el, show = true) => {
    const m = new maplibregl.Marker({ element: el }).setLngLat([lng, lat]);
    if (show) m.addTo(map);
    return m;
  };
  const html = (s) => { const d = document.createElement("div"); d.innerHTML = s.trim(); return d.firstChild; };

  pinAt(TRIP.base.lng, TRIP.base.lat, html('<span class="base-pin" title="Your SoMa base"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 11 12 4l8 7v9h-5v-6H9v6H4z"/></svg></span>'));

  const markers = {};
  // Pins pop in with a delay that grows with distance from SoMa, so they ripple outwards.
  for (const p of PLACES) {
    const delay = Math.round(Math.min(450, meters(TRIP.base, p) / 22));
    const el = html(`<div class="pin k-${p.kind}${p.approx ? " is-approx" : ""}" role="button" tabindex="0" aria-label="${esc(p.name)}">
      <span class="pin-b" style="animation-delay:${delay}ms"><svg viewBox="0 0 24 24" aria-hidden="true">${KIND[p.kind].icon}</svg></span></div>`);
    el.addEventListener("click", (e) => { e.stopPropagation(); select(p.id, { from: "map" }); });
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openSheet(p.id); } });
    markers[p.id] = { m: pinAt(p.lng, p.lat, el, false), el, on: false };
  }

  // Nearby shows the filtered places; Plan and Been show every pin and emphasise their own.
  const visibleIds = () => (state.tab === "explore" ? new Set(PLACES.filter(matches).map((p) => p.id)) : null);
  function focusIds() {
    if (state.tab === "plan") return new Set(DAYS.find((x) => x.date === state.day).steps.flatMap((s) => s.places || []));
    if (state.tab === "been") return new Set(Object.keys(visited));
    return null;
  }
  function renderMarkers(now) {
    const vis = visibleIds();
    const foc = focusIds();
    for (const p of PLACES) {
      const mk = markers[p.id];
      const show = !vis || vis.has(p.id) || state.sel === p.id;
      if (show !== mk.on) { if (show) mk.m.addTo(map); else mk.m.remove(); mk.on = show; }
      if (!show) continue;
      const el = mk.el;
      el.classList.toggle("is-visited", !!visited[p.id]);
      el.classList.toggle("is-closed", status(p, now).cls === "closed");
      el.classList.toggle("is-dim", !!foc && !foc.has(p.id));
      el.classList.toggle("is-sel", state.sel === p.id);
      el.style.zIndex = state.sel === p.id ? 3 : foc && foc.has(p.id) ? 2 : 1;
    }
  }
  function fitTo(ids, opts = {}) {
    const pts = [...ids].map((id) => byId[id]).filter(Boolean).map((p) => [p.lng, p.lat]);
    if (opts.withBase) pts.push([TRIP.base.lng, TRIP.base.lat]);
    if (!pts.length) return;
    const duration = opts.instant ? 0 : anim(700);
    if (pts.length === 1) { map.flyTo({ center: pts[0], zoom: 15.5, duration }); return; }
    const bounds = pts.reduce((b, pt) => b.extend(pt), new maplibregl.LngLatBounds(pts[0], pts[0]));
    map.fitBounds(bounds, { padding: 40, maxZoom: 15.5, duration });
  }
  function fitCurrent(instant) {
    const foc = focusIds();
    if (foc && foc.size) return fitTo(foc, { withBase: state.tab === "plan", instant });
    fitTo(visibleIds() || PLACES.map((p) => p.id), { instant });
  }

  function select(id, { from, pan } = {}) {
    state.sel = id;
    const p = byId[id];
    // Nudge the pin above centre so the preview card doesn't cover it.
    if (from === "map" || pan) map.easeTo({ center: [p.lng, p.lat], offset: [0, -30], duration: anim(450) });
    renderAll();
    if (from === "map") {
      document.querySelector(`.view:not([hidden]) [data-id="${id}"]`)?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
  map.on("click", () => { if (state.sel && !sheetId) { state.sel = null; renderAll(); } });

  // ── Location ─────────────────────────────────────────────────────────────
  let watchId = null, meMarker = null, firstFix = true, lastRenderAt = null;
  // The accuracy ring is a map layer so it scales with zoom: radius in pixels = metres / metres-per-pixel.
  function drawAccuracy() {
    if (!map.isStyleLoaded()) return;
    const data = { type: "Feature", geometry: { type: "Point", coordinates: [state.me.lng, state.me.lat] } };
    const r0 = (state.me.acc * 512) / (40075016.686 * Math.cos((state.me.lat * Math.PI) / 180));
    const radius = ["interpolate", ["exponential", 2], ["zoom"], 0, r0, 22, r0 * 2 ** 22];
    if (!map.getSource("me")) {
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim();
      map.addSource("me", { type: "geojson", data });
      map.addLayer({ id: "me-acc", type: "circle", source: "me", paint: {
        "circle-radius": radius, "circle-color": accent, "circle-opacity": 0.08,
        "circle-stroke-color": accent, "circle-stroke-width": 1, "circle-stroke-opacity": 0.35, "circle-pitch-alignment": "map",
      } });
    } else {
      map.getSource("me").setData(data);
      map.setPaintProperty("me-acc", "circle-radius", radius);
    }
  }
  function startWatch(center) {
    if (!("geolocation" in navigator)) { toast("This browser can't share your location."); return; }
    $("#btn-locate").classList.add("on");
    if (watchId != null) {
      if (center && state.me) map.flyTo({ center: [state.me.lng, state.me.lat], zoom: Math.max(map.getZoom(), 14.5), duration: anim(600) });
      return;
    }
    firstFix = true;
    watchId = navigator.geolocation.watchPosition((pos) => {
      state.me = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
      if (!meMarker) meMarker = pinAt(state.me.lng, state.me.lat, html('<div class="me-dot"></div>'));
      else meMarker.setLngLat([state.me.lng, state.me.lat]);
      drawAccuracy();
      if (firstFix) {
        firstFix = false;
        if (inSF()) map.jumpTo({ center: [state.me.lng, state.me.lat], zoom: 14.5 });
        lastRenderAt = state.me; renderAll(); return;
      }
      // Re-sort once you've moved a block or so.
      if (!lastRenderAt || meters(lastRenderAt, state.me) > 40) { lastRenderAt = state.me; renderAll(); }
    }, (err) => {
      $("#btn-locate").classList.remove("on");
      navigator.geolocation.clearWatch(watchId); watchId = null;
      toast(err.code === 1
        ? "Location is blocked. Allow it for this site in your browser settings."
        : "Couldn't find your location. Try again in a moment.");
    }, { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 });
  }

  // ── Toast ────────────────────────────────────────────────────────────────
  let toastTimer = null;
  function toast(msg, action) {
    const el = $("#toast");
    el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button" id="toast-act">${esc(action.label)}</button>` : ""}`;
    el.classList.remove("is-leaving");
    el.hidden = false;
    const hide = () => {
      el.classList.add("is-leaving");
      toastTimer = setTimeout(() => { el.hidden = true; el.classList.remove("is-leaving"); }, reducedMotion ? 0 : 180);
    };
    if (action) $("#toast-act").onclick = () => { action.run(); clearTimeout(toastTimer); hide(); };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hide, action ? 5000 : 3500);
  }

  // ── Been ─────────────────────────────────────────────────────────────────
  function setVisited(id, on) {
    if (on) visited[id] = new Date().toISOString(); else delete visited[id];
    store.set("visited", visited);
    renderAll();
  }
  function toggleVisited(id) {
    const p = byId[id];
    if (visited[id]) {
      const was = visited[id];
      setVisited(id, false);
      toast(`Unticked ${p.name}`, { label: "Undo", run: () => { visited[id] = was; store.set("visited", visited); renderAll(); } });
    } else {
      fx.tick = id;
      setVisited(id, true);
      navigator.vibrate?.(12);
      toast(`Been to ${p.name}`, { label: "Undo", run: () => setVisited(id, false) });
    }
  }
  function copyList() {
    const ids = Object.keys(visited).filter((id) => byId[id]).sort((a, b) => visited[a].localeCompare(visited[b]));
    const text = "Pour Decisions: places I've been\n" + ids.map((id) => `✓ ${byId[id].name} (${byId[id].area})`).join("\n");
    navigator.clipboard?.writeText(text).then(() => toast("Copied. Paste it into a note to keep a backup."),
      () => toast("Couldn't copy on this device."));
  }

  // ── Render all ───────────────────────────────────────────────────────────
  function renderAll() {
    const now = sfNow();
    renderClock(now);
    document.querySelectorAll(".tabs button").forEach((b) => {
      if (b.dataset.tab === state.tab) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current");
    });
    document.querySelectorAll(".view").forEach((v) => { v.hidden = v.dataset.view !== state.tab; });
    if (state.tab === "explore") renderExplore(now);
    if (state.tab === "plan") renderPlan(now);
    renderBeen(now);
    renderMarkers(now);
    renderPeek(now);
    renderSheet(now);
    fx.list = false; fx.tick = null;
  }

  // ── Events ───────────────────────────────────────────────────────────────
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;
    if (t.dataset.visit) { e.preventDefault(); toggleVisited(t.dataset.visit); return; }
    if (t.dataset.open) { openSheet(t.dataset.open); return; }
    if (t.dataset.kind) {
      const k = t.dataset.kind;
      if (state.kinds.has(k)) state.kinds.delete(k); else state.kinds.add(k);
      fx.list = true; saveUi(); renderAll(); return;
    }
    if (t.dataset.day) {
      if (state.day === t.dataset.day) return;
      state.day = t.dataset.day; state.sel = null; fx.list = true; renderAll(); fitCurrent(false); return;
    }
    if (t.dataset.tab) {
      if (state.tab === t.dataset.tab) { $("#panel").scrollTo({ top: 0, behavior: "smooth" }); return; }
      state.tab = t.dataset.tab; state.sel = null; confirmClear = false; fx.list = true; saveUi();
      $("#panel").scrollTop = 0; renderAll();
      if (state.tab !== "explore" || !inSF()) fitCurrent(false);
      return;
    }
    switch (t.id) {
      case "btn-locate": case "btn-locprompt": startWatch(true); return;
      case "btn-expand":
        state.mapBig = !state.mapBig;
        $("#app").classList.toggle("map-big", state.mapBig);
        t.setAttribute("aria-pressed", String(state.mapBig));
        t.setAttribute("aria-label", state.mapBig ? "Show the list again" : "Make the map bigger");
        setTimeout(() => map.resize(), 50);
        return;
      case "sheet-close": closeSheet(); return;
      case "btn-clear": confirmClear = true; renderAll(); return;
      case "btn-clear-no": confirmClear = false; renderAll(); return;
      case "btn-clear-yes":
        for (const k of Object.keys(visited)) delete visited[k];
        store.set("visited", visited); confirmClear = false; renderAll(); toast("All places unticked."); return;
      case "btn-copy": copyList(); return;
      default: return;
    }
  });
  $("#scrim").addEventListener("click", closeSheet);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && sheetId) closeSheet(); });
  $("#f-q").addEventListener("input", (e) => { state.q = e.target.value.trim(); renderAll(); });

  // Swipe the sheet down to close it.
  (() => {
    const sheet = $("#sheet"), body = $("#sheet-body");
    let y0 = null, dy = 0;
    sheet.addEventListener("touchstart", (e) => {
      if (e.target.closest(".sheet-actions") || body.scrollTop > 0) { y0 = null; return; }
      y0 = e.touches[0].clientY; dy = 0;
      sheet.style.transition = "none";
    }, { passive: true });
    sheet.addEventListener("touchmove", (e) => {
      if (y0 == null) return;
      dy = e.touches[0].clientY - y0;
      if (dy > 0) sheet.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    sheet.addEventListener("touchend", () => {
      if (y0 == null) return;
      y0 = null;
      if (dy > 90) { closeSheet(); return; } // the closing animation carries on from where the finger let go
      sheet.style.transition = "transform .25s cubic-bezier(.2,.8,.2,1)";
      sheet.style.transform = "";
    });
  })();

  // ── Boot ─────────────────────────────────────────────────────────────────
  renderAll();
  requestAnimationFrame(() => {
    map.resize();
    if (!inSF()) fitCurrent(true); // a location fix that arrived first already centred the map
    zoomClass();
  });
  window.addEventListener("resize", () => map.resize());
  setInterval(renderAll, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) renderAll(); });

  // Start location straight away if it's already allowed; otherwise the list offers it.
  navigator.permissions?.query({ name: "geolocation" }).then((r) => { if (r.state === "granted") startWatch(false); }, () => {});

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
