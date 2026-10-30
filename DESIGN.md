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

## Home-screen app

When the app is opened from the home screen, iOS blurs a strip under the status bar. So in that mode the header row is hidden: the icon already names the app and the phone shows the time. The map runs up under the status bar, where the blur reads as a frosted edge. When the phone's clock isn't on San Francisco time, the SF time appears in the line above the list instead.

## Type

- **Bricolage Grotesque** for the wordmark, the place name in the details sheet and the day titles. Nothing else uses it.
- **Atkinson Hyperlegible** for everything else. It was designed for legibility, which helps when you're reading in sunlight while walking.
- Scale: `--fs-xs` 12, `--fs-sm` 13, `--fs-md` 15, `--fs-lg` 18, `--fs-xl` 24. List rows use 15 for the name and 13 for the line under it.

## Space and shape

- Spacing: 4 / 8 / 12 / 16 / 24 (`--sp-1…5`). The side gutter is 16px, plus the safe-area inset where there is one.
- Radii: 8 (small), 12 (cards, buttons), 18 (sheet), pill (search and chips).
- Lists are plain rows separated by hairlines. White cards are used only for grouped stops in the Plan tab.

## Components

- **Row:** coloured dot, name, walking time on the right, and one muted line (area · status). The tick circle sits on the far right. The same row is used in Nearby, Plan and Been.
- **Chip:** an outlined pill. When on, it fills with its kind colour. With no chips on, everything shows.
- **Sheet:** title, a meta line, then only the sections that have content: notes, description, order, hours, address. Walk, Maps and Been here are pinned at the bottom.

## Motion

Motion is used to confirm an action or show where something went, never as decoration. Every animation is turned off when the phone's reduce-motion setting is on.

| Token | Value | Used for |
|---|---|---|
| `--dur-fast` | 150ms | Colour changes and press feedback (chips, buttons scale to 96%) |
| `--dur-base` | 240ms | Things arriving: list rows, the details sheet, the map preview card, the toast, switching tabs |
| `--dur-slow` | 380ms | Springy confirmations: ticking a place off, pins appearing |
| `--ease-out` | `cubic-bezier(.2,.8,.2,1)` | Entrances and slides |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Small overshoot for confirmations |

The moments:
- **Tick:** the circle pops and the check mark draws itself. The count on the Been tab bumps.
- **Lists:** the first dozen rows rise in, 24ms apart, but only after you change a filter, tab or day. Live updates (the clock, your location) never replay this.
- **Pins:** they pop in, rippling out from SoMa. Selecting one scales it up smoothly.
- **Map camera:** it flies between areas when you switch days or tabs.
- **Sheet:** it slides up to open and slides down to close. A swipe-down closes it from wherever your finger let go, and a short swipe springs back.
- **Plan days:** the underline slides to the day you pick.
