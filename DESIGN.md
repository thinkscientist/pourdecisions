# Pour Decisions design system

All tokens live at the top of `app.css`. Components use only the semantic tokens, never the raw palette. That way dark mode, which redefines the semantic tokens, just works.

## Palette: San Francisco

| Token | Light | Where it comes from | Used for |
|---|---|---|---|
| `--sf-bridge` | `#C0362C` | International Orange, Golden Gate Bridge | Accent: your location dot, the Walk button, the active tab, selection |
| `--sf-fog-50…500` | `#F2F4F4` → `#66737A` | Karl the Fog | Page background, surfaces, lines, muted text |
| `--sf-night` | `#13212B` | The bay after dark | Main text, and the dark-mode background family |
| `--sf-sourdough` | `#8C5A2B` | Sourdough crust | Coffee |
| `--sf-bay` | `#1D5C8A` | San Francisco Bay | Eat |
| `--sf-dusk` | `#7A3E78` | Twin Peaks at dusk | Drink |
| `--sf-cypress` | `#2D6A4A` | Presidio cypress | Open now, and "been here" ticks |
| `--sf-poppy` | `#B86E00` | California poppy | Closing soon |

Rules:
- Orange is the only accent. Each screen uses it for one or two things at most.
- Kind colours (coffee, eat, drink) appear only as dots, map pins and the selected filter chip.
- Status is shown as coloured text, not badges. Closed and "opens later" are muted grey, so they don't compete with what's open.

## Map

The map is OpenFreeMap's vector "Positron" style, recoloured at load time from the `--map-*` tokens. Light mode is fog-grey land, white streets, a bay-blue wash for water and a cypress wash for parks. Dark mode is the bay at night. City, state and country names are hidden so they don't sit on the pins. Pins use the kind colours, your position uses the accent, and the SoMa base is a small dark home marker.

## Layout

The map fills the screen and runs up under the status bar. The list is a drawer laid over it, with rounded top corners and a soft shadow that falls on the map only. Its title row carries the **Pour Decisions.** wordmark and a grab handle. There's no clock, since the phone already shows the time; the row only shows a time when previewing another day with `?now=`. Keeping the name on the drawer, not at the top, keeps it clear of the blur iOS puts under the status bar in home-screen apps.

**The drawer:** drag the title row down to slide the list away, leaving just the title row over a full-screen map. Drag it up to bring the list back. A flick decides by its direction; a slow drag settles on whichever side of halfway you let go. Tapping the handle or title row toggles it, and picking a tab brings the list back. While you drag, the drawer follows your finger, with resistance past either end. When it settles (`--dur-drawer`, 380ms), the map re-centres on the part you can still see. On wide screens the drawer is a fixed side panel.

## Type

- **Bricolage Grotesque** for the wordmark, the place name in the details sheet and the Plan heading. Nothing else uses it.
- **Atkinson Hyperlegible** for everything else. It was designed for legibility, which helps when you're reading in sunlight while walking.
- Scale: `--fs-xs` 12, `--fs-sm` 13, `--fs-md` 15, `--fs-lg` 18, `--fs-xl` 24. List rows use 15 for the name and 13 for the line under it.

## Space and shape

- Spacing: 4 / 8 / 12 / 16 / 24 (`--sp-1…5`). The side gutter is 16px, plus the safe-area inset where there is one.
- Radii: 8 (small), 12 (cards, buttons), 18 (sheet), pill (search and chips).
- Lists are plain rows separated by hairlines. White cards are used only for grouped stops in the Plan tab.

## Components

- **Row:** coloured dot and name (wrapping to two lines rather than being cut off), one muted line under it (area · status), then two fixed-width columns: walking time with a small walking-person icon (`--walk-col`), and the button (`--ctl-col`). Because both columns are fixed, the walking icons line up in a straight column down every list, whatever the button says. The same row is used everywhere. Its control on the right depends on the tab: **+ Add** / **✓ Added** in Nearby (added is an orange tint, not a solid fill, so a list of them stays calm), a green **✓ Been** button for places still to go in your plan, and a solid green tick for places you've been (tap to undo).
- **Plan:** your own list. **To go** is sorted nearest first. **Been** sits underneath, latest first, with times. It starts empty, with a hint pointing at the Add button. On the map, places in your plan get an orange ring.
- **Chip:** an outlined pill. When on, it fills with its kind colour. With no chips on, everything shows.
- **Sheet:** photos (when the venue's site has good ones), title, a meta line, two toggles (**Add to plan** and **Mark as been**, so you can tick somewhere you wandered into), then only the sections that have content: notes, description, order, hours, address. Walk and Google Maps are pinned at the bottom.

## Motion

Motion is used to confirm an action or show where something went, never as decoration. Every animation is turned off when the phone's reduce-motion setting is on.

| Token | Value | Used for |
|---|---|---|
| `--dur-fast` | 150ms | Colour changes and press feedback (chips, buttons scale to 96%) |
| `--dur-base` | 240ms | Things arriving: list rows, the details sheet, the map preview card, the toast, switching tabs |
| `--dur-slow` | 380ms | Springy confirmations: ticking a place off, pins appearing, a filter button turning on |
| `--dur-list` | 420ms | A row rising into a list |
| `--stagger` | 45ms | The gap between rows rising in |
| `--dur-drawer` | 380ms | The list drawer settling open or closed |
| `--ease-out` | `cubic-bezier(.2,.8,.2,1)` | Entrances and slides |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Small overshoot for confirmations |

The moments:
- **Add and Been:** the pill pops and its check mark draws itself. The count on the Plan tab bumps when you add something.
- **Lists:** the first dozen rows rise in (`--dur-list`, 420ms, each `--stagger` 45ms after the last), but only after you change a filter, tab or day. Live updates (the clock, your location) never replay this.
- **Filters:** two beats. The button fills with a small spring, the old rows fade up and out (180ms), and pins that no longer match shrink away. Then the new rows rise in and the matching pins pop in, rippling out from the middle of the map.
- **Pins:** they pop in, rippling out from SoMa. Selecting one scales it up smoothly.
- **Map camera:** it flies between areas when you switch days or tabs.
- **Sheet:** it slides up to open and slides down to close. A swipe-down closes it from wherever your finger let go, and a short swipe springs back.
- **Plan days:** the underline slides to the day you pick.

## Photos

Up to three photos per place, taken from the venue's own website and chosen by hand: the room, the storefront or the food. Logos, coffee-bag product shots, staff portraits and event posters are left out. They're loaded straight from the venue's site (not copied into this repo) and credited with a link back. On the details sheet they form a swipeable strip; the next photo peeks in so it's clear there's more. Only the first loads when the sheet opens, each fades in once loaded, and one that fails to load quietly drops out. Places without good photos on their site show a "See photos on Google Maps" link instead.
