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
  function hoursText(p, date) {
    const spec = specFor(p, date);
    if (!spec) return { text: "Not in the guide", cls: "unk" };
    if (spec === "closed") return { text: "Closed", cls: "closed" };
    return {
      text: ranges(spec).map((r) => (r.o == null ? `Until ${fmtTime(r.c)}` : `${fmtTime(r.o)}–${fmtTime(r.c)}`)).join(", "),
      cls: "",
    };
  }
  function status(p, now) {
    const spec = specFor(p, now.date);
    if (!spec) return { cls: "unknown", text: "Hours not listed" };
    if (spec === "closed") return { cls: "closed", text: "Closed today" };
    const m = now.mins;
    for (const r of ranges(spec)) {
      if ((r.o == null || m >= r.o) && m < r.c) {
        const left = r.c - m;
        if (left <= 45) return { cls: "soon", text: `Closes in ${left} min`, open: true };
        return { cls: "open", text: r.o == null ? `Until ${fmtTime(r.c)}` : `Open · until ${fmtTime(r.c)}`, open: true };
      }
      if (r.o != null && m < r.o) return { cls: "later", text: `Opens ${fmtTime(r.o)}` };
    }
    return { cls: "closed", text: "Closed for the day" };
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
    if (mins < 60) return `${mins} min walk`;
    const h = Math.floor(mins / 60), r = mins % 60;
    return `${h} hr${r >= 10 ? ` ${r} min` : ""} walk`;
  }

  // ── State ────────────────────────────────────────────────────────────────
  const visited = store.get("visited", {}); // id -> ISO timestamp
  const saved = store.get("ui", {});
  const now0 = sfNow();
  const tripDay = DAYS.find((d) => d.date === now0.date);
  const state = {
    tab: saved.tab || "explore",
    kind: saved.kind || "all",
    openOnly: !!saved.openOnly,
    unvisited: !!saved.unvisited,
    eater: !!saved.eater,
    q: "",
    sel: null,
    day: tripDay ? tripDay.date : (now0.date > TRIP.end ? DAYS[DAYS.length - 1].date : DAYS[0].date),
    me: null,
    mapBig: false,
  };
  const saveUi = () => store.set("ui", { tab: state.tab, kind: state.kind, openOnly: state.openOnly, unvisited: state.unvisited, eater: state.eater });

  const SF_CENTER = { lat: 37.7749, lng: -122.4194 };
  const inSF = () => state.me && meters(state.me, SF_CENTER) < 30000;
  const origin = () => (inSF() ? state.me : TRIP.base);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fold = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const KIND = {
    coffee: { label: "Coffee", icon: '<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5z"/><path d="M16 10.5h1.5a2.5 2.5 0 0 1 0 5H16"/><path d="M8.5 3.5v3M12.5 3.5v3"/>' },
    food: { label: "Eat", icon: '<path d="M7 3v18M4.5 3v5a2.5 2.5 0 0 0 5 0V3"/><path d="M17 21V3c-2.2 1.6-3.3 4.2-3.3 7.5V14H17"/>' },
    drinks: { label: "Drinks", icon: '<path d="M4.5 4h15L12 12.5z"/><path d="M12 12.5V20M8 20h8"/>' },
    bakery: { label: "Bakery", icon: '<path d="M3.5 15.5c0-5.2 3.8-9.5 8.5-9.5s8.5 4.3 8.5 9.5c0 1.7-1.3 2.5-2.7 2.5H6.2c-1.4 0-2.7-.8-2.7-2.5z"/><path d="M9 10.5v3.5M12 9.5v4.5M15 10.5v3.5"/>' },
  };
  const kindOf = (p) => KIND[p.kind];
  const gmapsSearch = (p) => "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.q);
  const gmapsWalk = (p) => "https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=" + encodeURIComponent(p.q);
  const checkSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5.5 12.5 4 4L18.5 8"/></svg>';
  const walkSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-6.5L14 17v4M7 12.5l2.5-4.5 4 1.5 2.5 3.5M11.5 14.5 13 9"/></svg>';
  const mapSvg = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6z"/><path d="M9 4v14M15 6v14"/></svg>';

  function matches(p, now) {
    if (state.kind !== "all") {
      if (state.kind === "coffee" ? !(p.kind === "coffee" || p.kind === "bakery") : p.kind !== state.kind) return false;
    }
    if (state.unvisited && visited[p.id]) return false;
    if (state.eater && !p.eater38) return false;
    if (state.openOnly && !status(p, now).open) return false;
    if (state.q) {
      const hay = fold([p.name, p.area, p.group, p.blurb, p.order, p.addr].join(" "));
      if (!fold(state.q).split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    return true;
  }

  function flagsHtml(p, date) {
    const out = [];
    if (p.book) out.push('<span class="flag hot">Book ahead</span>');
    for (const t of p.tags || []) if (!/^book/i.test(t)) out.push(`<span class="flag${/cash/i.test(t) ? " hot" : ""}">${esc(t)}</span>`);
    if (p.dateWarn && p.dateWarn[date]) out.push('<span class="flag hot">Heads up today</span>');
    return out.slice(0, 3).join("");
  }

  function cardHtml(p, now, opts = {}) {
    const st = opts.dayStatus || status(p, now);
    const mins = walkMins(meters(origin(), p));
    const v = !!visited[p.id];
    const k = kindOf(p);
    return `<li class="${opts.mini ? "mini" : "card"} k-${p.kind}${v ? " is-visited" : ""}${state.sel === p.id ? " is-sel" : ""}" data-id="${p.id}">
      <button type="button" class="card-main" data-open="${p.id}">
        <span class="card-name"><i class="dot" aria-label="${k.label}"></i><span>${esc(p.name)}</span></span>
        <span class="card-meta"><span class="walk">${walkText(mins)}</span><span>· ${esc(p.area)}</span>${p.price ? `<span>· ${esc(p.price)}</span>` : ""}</span>
        <span class="card-row"><span class="pill st-${st.cls}">${esc(st.text)}</span>${flagsHtml(p, now.date)}</span>
        ${!opts.mini && p.order ? `<span class="card-order"><b>Order:</b> ${esc(p.order)}</span>` : ""}
      </button>
      <button type="button" class="check" data-visit="${p.id}" aria-pressed="${v}" aria-label="${v ? "Visited. Tap to undo" : "Mark as visited"}: ${esc(p.name)}"><i>${checkSvg}</i></button>
    </li>`;
  }

  // ── Header clock ─────────────────────────────────────────────────────────
  function renderClock(now) {
    $("#clock").innerHTML = `<b>${fmtTime(now.mins)}</b>${dayLabel(now.date)}${now.pinned ? " (preview)" : " · SF"}`;
  }

  // ── Explore ──────────────────────────────────────────────────────────────
  function renderExplore(now) {
    document.querySelectorAll(".seg button").forEach((b) => b.setAttribute("aria-checked", String(b.dataset.kind === state.kind)));
    $("#f-open").setAttribute("aria-pressed", String(state.openOnly));
    $("#f-unvisited").setAttribute("aria-pressed", String(state.unvisited));
    $("#f-eater").setAttribute("aria-pressed", String(state.eater));

    const o = origin();
    const list = PLACES.filter((p) => matches(p, now))
      .map((p) => ({ p, d: meters(o, p) }))
      .sort((a, b) => a.d - b.d);
    $("#list").innerHTML = list.map(({ p }) => cardHtml(p, now)).join("");
    $("#list-empty").hidden = list.length > 0;

    let note;
    if (inSF()) note = `${list.length} places · nearest to you first`;
    else if (state.me) note = `${list.length} places · you're not in SF yet, so times are from your SoMa base`;
    else note = `${list.length} places · walking times from your SoMa base`;
    if (state.openOnly) {
      const unknown = PLACES.filter((p) => !specFor(p, now.date)).length;
      note += ` · ${unknown} with unlisted hours hidden`;
    }
    $("#sortnote").textContent = note;
  }

  // ── Plan ─────────────────────────────────────────────────────────────────
  function renderPlan(now) {
    $("#days").innerHTML = DAYS.map((d) => {
      const [wd, dd] = [new Date(d.date + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", timeZone: "UTC" }), +d.date.slice(8)];
      return `<button type="button" class="day" role="tab" data-day="${d.date}" aria-selected="${d.date === state.day}">
        <small>${wd}</small><strong>${dd}</strong><em>${d.date === now.date ? "Today" : ""}</em></button>`;
    }).join("");

    const d = DAYS.find((x) => x.date === state.day);
    const isToday = d.date === now.date;
    const dayNow = { date: d.date, mins: isToday ? now.mins : 0 };
    const placeRow = (id) => {
      const p = byId[id];
      let st;
      if (!isToday) {
        const h = hoursText(p, d.date);
        st = h.cls === "closed" ? { cls: "closed", text: "Closed" } : h.cls === "unk" ? { cls: "unknown", text: "Hours not listed" } : { cls: "open", text: h.text };
      }
      return cardHtml(p, dayNow, { mini: true, dayStatus: st });
    };
    const done = d.steps.flatMap((s) => s.places || []).filter((id) => visited[id]).length;
    const total = d.steps.flatMap((s) => s.places || []).length;

    $("#dayplan").innerHTML = `
      <div class="plan-head">
        <h2>${esc(d.title)}</h2>
        <p>${esc(dayLabel(d.date))}${isToday ? " · today" : ""} · ${done} of ${total} stops ticked${isToday ? "" : " · hours shown for this day"}</p>
      </div>
      <div class="heads-up"><h3>Watch out</h3><ul>${d.watch.map((w) => `<li>${esc(w)}</li>`).join("")}</ul></div>
      <ol class="steps">${d.steps.map((s) => `
        <li class="step"><span class="step-k">${esc(s.k)}</span>
          <div class="step-body"><span class="step-text">${esc(s.text)}</span>
          ${(s.places || []).length ? `<ol class="cards">${s.places.map(placeRow).join("")}</ol>` : ""}</div>
        </li>`).join("")}
      </ol>
      <p class="plan-foot">Every morning starts in SoMa. Swap days freely, keeping the closures in mind. Hours can change for holidays and private events, so re-check on the day.</p>`;
  }

  // ── Been there ───────────────────────────────────────────────────────────
  let confirmClear = false;
  function renderBeen(now) {
    const ids = Object.keys(visited).filter((id) => byId[id]);
    $("#been-count").textContent = ids.length ? `· ${ids.length}` : "";
    if (state.tab !== "been") return;
    const group = (f) => { const all = PLACES.filter(f); return [all.filter((p) => visited[p.id]).length, all.length]; };
    const bars = [
      ["Coffee", "k-coffee", group((p) => p.kind === "coffee")],
      ["Eat", "k-food", group((p) => p.kind === "food")],
      ["Drinks", "k-drinks", group((p) => p.kind === "drinks")],
      ["Bakeries", "k-bakery", group((p) => p.kind === "bakery")],
      ["Eater 38", "", group((p) => p.eater38)],
    ];
    const sorted = ids.sort((a, b) => visited[b].localeCompare(visited[a]));
    const when = (iso) => {
      const d = new Date(iso);
      return d.toLocaleString("en-GB", { timeZone: "America/Los_Angeles", weekday: "short", day: "numeric", month: "short", hour: "numeric", minute: "2-digit", hour12: true }).replace(/ (am|pm)/, "$1");
    };
    $("#been").innerHTML = `
      <div class="tally"><div class="tally-big">${ids.length} <small>of ${PLACES.length} places</small></div></div>
      <div class="bars">${bars.map(([label, k, [n, t]]) => `
        <div class="bar ${k}"><span>${label}</span><span class="bar-track"><span class="bar-fill" style="width:${t ? (100 * n) / t : 0}%"></span></span><span class="bar-n">${n}/${t}</span></div>`).join("")}
      </div>
      ${sorted.length ? `<h3 class="subhead">Most recent first</h3>
        <ol class="cards">${sorted.map((id) => cardHtml(byId[id], now).replace('<span class="card-row">', `<span class="been-when">${when(visited[id])}</span><span class="card-row">`)).join("")}</ol>
        <div class="been-tools">
          <button type="button" class="btn small" id="btn-copy">Copy my list</button>
          ${confirmClear
            ? `<span class="confirm">Untick all ${ids.length}? <button type="button" class="btn small danger" id="btn-clear-yes">Untick all</button><button type="button" class="btn small" id="btn-clear-no">Keep</button></span>`
            : `<button type="button" class="btn small danger" id="btn-clear">Untick all</button>`}
        </div>`
      : `<p class="empty">Nothing ticked yet. When you've been somewhere, tap the circle on its card and it shows up here with the time.</p>`}`;
  }

  // ── Sheet (place details) ────────────────────────────────────────────────
  let sheetId = null;
  function renderSheet(now) {
    if (!sheetId) return;
    const p = byId[sheetId];
    const st = status(p, now);
    const k = kindOf(p);
    const mins = walkMins(meters(origin(), p));
    const v = !!visited[p.id];
    const notes = [];
    if (p.warn) notes.push(`<div class="note"><b>Heads up.</b> ${esc(p.warn)}</div>`);
    if (p.dateWarn && p.dateWarn[now.date]) notes.push(`<div class="note"><b>Today.</b> ${esc(p.dateWarn[now.date])}</div>`);
    if (p.hoursNote) notes.push(`<div class="note soft">${esc(p.hoursNote)}</div>`);
    const fromWhere = inSF() ? "from you" : "from SoMa base";

    $("#sheet").className = `sheet k-${p.kind}`;
    $("#sheet-body").innerHTML = `
      <div>
        <div class="d-eyebrow"><i class="dot"></i>${esc(k.label)} · ${esc(p.group)}${p.eater38 ? " · Eater 38" : ""}</div>
        <h2 class="d-name" id="sheet-title">${esc(p.name)}</h2>
        <div class="d-meta">${esc(p.area)}${p.price ? ` · ${esc(p.price)}` : ""} · ${walkText(mins)} ${fromWhere}</div>
      </div>
      <div class="card-row"><span class="pill st-${st.cls}">${esc(st.text)}</span>${flagsHtml(p, now.date)}</div>
      ${notes.join("")}
      ${p.order ? `<div class="d-sec"><h3>What to order</h3><p class="d-order">${esc(p.order)}</p></div>` : ""}
      <div class="d-sec"><h3>Why go</h3><p>${esc(p.blurb)}</p></div>
      <div class="d-sec"><h3>Hours on your trip</h3>
        <table class="hours"><tbody>${DAYS.map((d) => {
          const h = hoursText(p, d.date);
          return `<tr class="${d.date === now.date ? "today" : ""}"><td>${dayLabel(d.date)}</td><td class="${h.cls}">${esc(h.text)}</td></tr>`;
        }).join("")}</tbody></table>
      </div>
      <div class="d-sec"><h3>Address</h3>
        <div class="addr"><span>${esc(p.addr || p.area)}</span>${p.approx ? "<small>Pin shows the neighbourhood</small>" : p.addrFromMap ? "<small>From map data</small>" : ""}</div>
      </div>`;
    $("#sheet-actions").innerHTML = `
      <a class="btn primary" href="${gmapsWalk(p)}" target="_blank" rel="noopener">${walkSvg}Walk there</a>
      <a class="btn" href="${gmapsSearch(p)}" target="_blank" rel="noopener">${mapSvg}Maps</a>
      <button type="button" class="btn${v ? " done" : ""}" data-visit="${p.id}" aria-pressed="${v}">${checkSvg}${v ? "Been" : "I've been"}</button>`;
  }
  let lastFocus = null;
  function openSheet(id) {
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
    sheetId = null;
    $("#sheet").hidden = true;
    $("#scrim").hidden = true;
    if (lastFocus && lastFocus.isConnected) lastFocus.focus({ preventScroll: true });
  }

  // ── Peek (pin tapped on the map) ─────────────────────────────────────────
  function renderPeek(now) {
    const el = $("#peek");
    if (!state.sel || sheetId) { el.hidden = true; return; }
    const p = byId[state.sel];
    const st = status(p, now);
    el.className = `peek k-${p.kind}`;
    el.innerHTML = `
      <button type="button" class="peek-main" data-open="${p.id}">
        <span class="peek-name">${esc(p.name)}</span>
        <span class="peek-meta"><span class="pill st-${st.cls}">${esc(st.text)}</span><span>${walkText(walkMins(meters(origin(), p)))}</span></span>
      </button>
      <a class="btn primary small" href="${gmapsWalk(p)}" target="_blank" rel="noopener" aria-label="Walk to ${esc(p.name)} in Google Maps">${walkSvg}Go</a>`;
    el.hidden = false;
  }

  // ── Map ──────────────────────────────────────────────────────────────────
  const map = L.map("map", { zoomControl: false, attributionControl: true, tap: true }).setView([37.775, -122.43], 13);
  map.attributionControl.setPrefix(false);
  // OpenStreetMap's standard tiles: free, no key. Dark mode tints them in CSS.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  // Small, glyph-free pins when the whole city is in view.
  const zoomClass = () => $("#map").classList.toggle("zoomed-out", map.getZoom() < 14);
  map.on("zoomend", zoomClass);

  L.marker([TRIP.base.lat, TRIP.base.lng], {
    icon: L.divIcon({ className: "", html: '<span class="base-pin">SoMa base</span>', iconSize: [0, 0] }),
    interactive: false, keyboard: false, zIndexOffset: -1000,
  }).addTo(map);

  const markers = {};
  function pinIcon(p, cls) {
    return L.divIcon({
      className: `pin k-${p.kind} ${cls}`,
      html: `<span class="pin-b"><svg viewBox="0 0 24 24" aria-hidden="true">${kindOf(p).icon}</svg></span>`,
      iconSize: [30, 30], iconAnchor: [15, 15],
    });
  }
  for (const p of PLACES) {
    const m = L.marker([p.lat, p.lng], { icon: pinIcon(p, ""), title: p.name, riseOnHover: true });
    m.on("click", () => select(p.id, { from: "map" }));
    markers[p.id] = m;
  }

  function visibleIds(now) {
    if (state.tab === "explore") return new Set(PLACES.filter((p) => matches(p, now)).map((p) => p.id));
    return null; // every pin shown; emphasis handled by focusIds
  }
  function focusIds() {
    if (state.tab === "today") {
      const d = DAYS.find((x) => x.date === state.day);
      return new Set(d.steps.flatMap((s) => s.places || []));
    }
    if (state.tab === "been") return new Set(Object.keys(visited));
    return null;
  }
  function renderMarkers(now) {
    const vis = visibleIds(now);
    const foc = focusIds();
    for (const p of PLACES) {
      const m = markers[p.id];
      const show = !vis || vis.has(p.id) || state.sel === p.id;
      if (!show) { if (map.hasLayer(m)) map.removeLayer(m); continue; }
      const st = status(p, now);
      const cls = [
        visited[p.id] && "is-visited",
        st.cls === "closed" && "is-closed",
        foc && !foc.has(p.id) && "is-dim",
        state.sel === p.id && "is-sel",
        p.approx && "is-approx",
      ].filter(Boolean).join(" ");
      if (m._pdCls !== cls) { m.setIcon(pinIcon(p, cls)); m._pdCls = cls; }
      m.setZIndexOffset(state.sel === p.id ? 1000 : foc && foc.has(p.id) ? 500 : 0);
      if (!map.hasLayer(m)) m.addTo(map);
    }
  }
  function fitTo(ids, opts = {}) {
    const pts = [...ids].map((id) => byId[id]).filter(Boolean).map((p) => [p.lat, p.lng]);
    if (opts.withBase) pts.push([TRIP.base.lat, TRIP.base.lng]);
    if (opts.withMe && inSF()) pts.push([state.me.lat, state.me.lng]);
    if (!pts.length) return;
    if (pts.length === 1) map.setView(pts[0], 16, { animate: !opts.instant });
    else map.fitBounds(pts, { padding: [36, 36], maxZoom: 16, animate: !opts.instant });
  }
  function fitCurrent(instant) {
    const now = sfNow();
    const foc = focusIds();
    if (foc && foc.size) return fitTo(foc, { withBase: state.tab === "today", instant });
    fitTo(visibleIds(now) || PLACES.map((p) => p.id), { instant });
  }

  function select(id, { from, pan } = {}) {
    state.sel = id;
    const p = byId[id];
    if (from === "map" || pan) {
      map.panTo([p.lat, p.lng], { animate: true });
    }
    renderAll();
    if (from === "map" && state.tab === "explore") {
      const card = document.querySelector(`#list [data-id="${id}"]`);
      card?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }
  map.on("click", () => { if (state.sel && !sheetId) { state.sel = null; renderAll(); } });

  // ── Location ─────────────────────────────────────────────────────────────
  let watchId = null, meMarker = null, meCircle = null, firstFix = true, lastRenderAt = null;
  function startWatch(center) {
    if (!("geolocation" in navigator)) { toast("This browser can't share your location."); return; }
    $("#btn-locate").classList.add("on");
    if (watchId != null) { if (center && state.me) map.setView([state.me.lat, state.me.lng], Math.max(map.getZoom(), 15)); return; }
    firstFix = true;
    watchId = navigator.geolocation.watchPosition((pos) => {
      state.me = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
      const ll = [state.me.lat, state.me.lng];
      if (!meMarker) {
        meCircle = L.circle(ll, { radius: state.me.acc, color: "#D44A27", weight: 1, fillOpacity: 0.08, interactive: false }).addTo(map);
        meMarker = L.marker(ll, { icon: L.divIcon({ className: "", html: '<div class="me-dot"></div>', iconSize: [18, 18], iconAnchor: [9, 9] }), interactive: false, zIndexOffset: 2000 }).addTo(map);
      } else { meMarker.setLatLng(ll); meCircle.setLatLng(ll).setRadius(state.me.acc); }
      $("#locprompt").hidden = true;
      if (firstFix) {
        firstFix = false;
        if (inSF()) map.setView(ll, 15, { animate: false });
        else toast("You're not in San Francisco yet. Walking times use your SoMa base for now.");
        lastRenderAt = state.me; renderAll(); return;
      }
      // Re-sort once you've moved a block or so.
      if (!lastRenderAt || meters(lastRenderAt, state.me) > 40) { lastRenderAt = state.me; renderAll(); }
    }, (err) => {
      $("#btn-locate").classList.remove("on");
      navigator.geolocation.clearWatch(watchId); watchId = null;
      if (err.code === 1) {
        toast("Location is blocked. Allow it for this site in your browser settings to sort by distance.");
        $("#locprompt").hidden = false;
      } else toast("Couldn't find your location. Try again in a moment.");
    }, { enableHighAccuracy: true, maximumAge: 15000, timeout: 20000 });
  }

  // ── Toast ────────────────────────────────────────────────────────────────
  let toastTimer = null;
  function toast(msg, action) {
    const el = $("#toast");
    el.innerHTML = `<span>${esc(msg)}</span>${action ? `<button type="button" id="toast-act">${esc(action.label)}</button>` : ""}`;
    el.hidden = false;
    if (action) $("#toast-act").onclick = () => { action.run(); el.hidden = true; };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, action ? 5000 : 3500);
  }

  // ── Visited ──────────────────────────────────────────────────────────────
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
      setVisited(id, true);
      navigator.vibrate?.(12);
      toast(`Ticked off ${p.name}`, { label: "Undo", run: () => setVisited(id, false) });
    }
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
    if (state.tab === "today") renderPlan(now);
    renderBeen(now);
    renderMarkers(now);
    renderPeek(now);
    renderSheet(now);
  }

  // ── Events ───────────────────────────────────────────────────────────────
  document.addEventListener("click", (e) => {
    const t = e.target.closest("button, a");
    if (!t) return;
    if (t.dataset.visit) { e.preventDefault(); toggleVisited(t.dataset.visit); return; }
    if (t.dataset.open) { openSheet(t.dataset.open); return; }
    if (t.dataset.kind) { state.kind = t.dataset.kind; saveUi(); renderAll(); return; }
    if (t.dataset.day) { state.day = t.dataset.day; state.sel = null; renderAll(); fitCurrent(); return; }
    if (t.dataset.tab) {
      if (state.tab === t.dataset.tab) { $("#panel").scrollTo({ top: 0, behavior: "smooth" }); return; }
      state.tab = t.dataset.tab; state.sel = null; confirmClear = false; saveUi();
      $("#panel").scrollTop = 0; renderAll();
      if (state.tab !== "explore") fitCurrent();
      return;
    }
    switch (t.id) {
      case "f-open": state.openOnly = !state.openOnly; break;
      case "f-unvisited": state.unvisited = !state.unvisited; break;
      case "f-eater": state.eater = !state.eater; break;
      case "f-search": {
        const row = $("#searchrow");
        if (row.hidden) { row.hidden = false; $("#f-q").focus(); }
        else { row.hidden = true; $("#f-q").value = ""; state.q = ""; }
        t.setAttribute("aria-pressed", String(!row.hidden));
        break;
      }
      case "btn-locate": startWatch(true); return;
      case "btn-locprompt": startWatch(true); return;
      case "btn-fit": fitCurrent(false); return;
      case "btn-expand":
        state.mapBig = !state.mapBig;
        $("#app").classList.toggle("map-big", state.mapBig);
        t.setAttribute("aria-pressed", String(state.mapBig));
        t.setAttribute("aria-label", state.mapBig ? "Show the list again" : "Make the map bigger");
        setTimeout(() => map.invalidateSize(), 50);
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
    saveUi(); renderAll();
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
    }, { passive: true });
    sheet.addEventListener("touchmove", (e) => {
      if (y0 == null) return;
      dy = e.touches[0].clientY - y0;
      if (dy > 0) sheet.style.transform = `translateY(${dy}px)`;
    }, { passive: true });
    sheet.addEventListener("touchend", () => {
      if (y0 == null) return;
      sheet.style.transform = "";
      if (dy > 90) closeSheet();
      y0 = null;
    });
  })();

  function copyList() {
    const ids = Object.keys(visited).filter((id) => byId[id]).sort((a, b) => visited[a].localeCompare(visited[b]));
    const text = "Pour Decisions: places I've been\n" + ids.map((id) => `✓ ${byId[id].name} (${byId[id].area})`).join("\n");
    navigator.clipboard?.writeText(text).then(() => toast("Copied. Paste it into a note to keep a backup."),
      () => toast("Couldn't copy on this device."));
  }

  // ── Boot ─────────────────────────────────────────────────────────────────
  renderAll();
  requestAnimationFrame(() => {
    map.invalidateSize();
    if (!inSF()) fitCurrent(true); // a location fix that arrived first already centred the map
    zoomClass();
  });
  window.addEventListener("resize", () => map.invalidateSize());
  setInterval(renderAll, 30000);
  document.addEventListener("visibilitychange", () => { if (!document.hidden) renderAll(); });

  // Location: start straight away if already allowed, otherwise ask with a card.
  if (navigator.permissions?.query) {
    navigator.permissions.query({ name: "geolocation" }).then((r) => {
      if (r.state === "granted") startWatch(false); else $("#locprompt").hidden = false;
    }, () => { $("#locprompt").hidden = false; });
  } else $("#locprompt").hidden = false;

  if ("serviceWorker" in navigator && location.protocol === "https:") {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
