// Pour Decisions: St Albans, Hertfordshire, UK.
// Picks from olive magazine's "best restaurants in St Albans" (June 2026), Harden's St Albans
// guide, DesignMyNight's best bars, A Friend Abroad's coffee spots (2025) and pub guides,
// gathered 21 Nov 2026. Positions geocoded from OpenStreetMap and checked by hand.
// The guides give no opening hours, so none are shown: check before you go. Prices are in pounds,
// and only shown where a guide gave one.

window.CITIES.stalbans = {
  name: "St Albans", short: "St Albans", tz: "Europe/London",
  center: { lat: 51.7513, lng: -0.3405 },
  base: { name: "St Albans City station", lat: 51.7505, lng: -0.32767 },
  radius: 12000, // the town and its edges; London starts not far south
  fit: 1600, // a small city: frame the centre; edge-of-town picks are a scroll or pinch away
  sources: "olive, Harden's and DesignMyNight guides, gathered 21 Nov 2026",
};

window.PLACES.push(...[
  // ── Restaurants ───────────────────────────────────────────────────────
  ["iberos", "Iberos", "food", "George Street", "8 George Street", "", [51.75136, -0.34207],
    "Counter-style Spanish and Portuguese small plates, and one of olive's St Albans favourites.", "Salt cod fritters, the ibérico pork chop, and the olive-oil panna cotta.", ["Walk-in only"], false],
  ["dylans", "Dylans at The Kings Arms", "food", "George Street", "7 George Street", "£££", [51.75142, -0.34193],
    "Seasonal British cooking in a 15th-century Tudor building, with a good-value set lunch.", "Smoked duck scotch egg, then sticky toffee pudding with clotted cream.", [], false],
  ["boot-cantina", "Boot Cantina at The Boot", "food", "Market Place", "4 Market Place", "", [51.75124, -0.34022],
    "Fusion sharing tacos in a pub built in 1420, right by the Clock Tower.", "The confit duck leg taco, then chocolate-stuffed churros.", [], false],
  ["lussmanns", "Lussmanns", "food", "City centre", "Waxhouse Gate, High Street", "££", [51.75087, -0.34118],
    "A consistently good local: sustainable British cooking, almost all UK-sourced, over three floors.", "Plaice with North Sea brown shrimps; the two- or three-course set menu is good value.", ["Sustainable"], false],
  ["tabure", "Tabure", "food", "City centre", "6 Spencer Street", "££", [51.7527, -0.33948],
    "Turkish sharing plates, with organic meat from Wales's Rhug Estate. Good with allergies.", "Order several plates to share.", ["Book ahead"], true],
  ["hazels", "Hazéls", "food", "Verulam Road", "5 Verulam Road", "", [51.75201, -0.34166],
    "A pocket-sized, French-leaning restaurant and wine bar, with guest DJs playing vinyl.", "Panisse, onglet steak, and a rhubarb negroni.", ["Special occasion"], false],
  ["vesper", "Vesper", "food", "Verulam Road", "The Hub, 5B Verulam Road", "", [51.75196, -0.34161],
    "Late-night small plates in a corner of The Hub, with a tableside martini trolley. Evenings only.", "Grilled focaccia with aioli, BBQ XL prawns, and a martini from the trolley.", ["Evenings"], false],
  ["hatch", "Hatch", "food", "Christopher Place", "7–8 Christopher Place", "", [51.75174, -0.34072],
    "Diner-style brunch, usually buzzing at weekends.", "Buffalo benedict, and a compost cookie to go.", ["Book at weekends"], true],
  ["megans", "Megan's at the Old Bell", "food", "City centre", "22 Chequer Street", "££", [51.75161, -0.33899],
    "Colourful and relaxed, with friendly staff and plenty of dogs.", "Sunday's bottomless Bloody Mary or Mimosa.", ["Dog-friendly"], false],
  ["waffle-house", "The Waffle House", "food", "St Michael's", "Kingsbury Watermill, St Michael's Street", "", [51.75462, -0.35241],
    "Belgian waffles in a 16th-century watermill, a 10-minute walk from the centre.", "The pulled-pork savoury waffle, or banana, flapjack and pecan.", [], false],
  ["omboo", "Omboo at Sopwell House", "food", "Sopwell", "Sopwell House, Cottonmill Lane", "£££", [51.7348, -0.32677],
    "Asian-inspired occasion dining at the Sopwell House hotel; the set menu is about £85 a head.", "Sticky glazed aubergine, yellowtail carpaccio with ponzu, seared wagyu.", ["Book ahead", "Special occasion"], true],
  ["graceys", "Gracey's Pizza", "food", "Chiswell Green", "339 Watford Road, Chiswell Green", "", [51.72696, -0.35941],
    "New Haven-style pizza from a tiny spot. Click-and-collect slots go fast.", "The New Haven.", ["Order ahead", "Takeaway"], true],
  ["potting-shed", "The Potting Shed", "food", "Sandridge", "Carpenters Nursery, 106 St Albans Road, Sandridge", "", [51.77371, -0.31556],
    "A farm shop café on the road to Sandridge, best for lunch.", "Mushrooms on toast with poached egg and goat's cheese mousse.", [], false],

  // ── Coffee, cafés and sweets ─────────────────────────────────────────
  ["nkora", "Nkora", "coffee", "Market Place", "26 Market Place", "£", [51.75184, -0.33958],
    "A calm, good-looking café that locals rate among the best in town.", "", [], false],
  ["viento", "Viento Coffee", "coffee", "Hatfield Road", "115 Hatfield Road", "£", [51.75256, -0.31863],
    "Roasts its own beans; reviewers call it probably the best coffee in St Albans.", "Anything from their own roast.", ["Roaster"], false],
  ["charlies", "Charlie's Coffee & Company", "coffee", "London Road", "87 London Road", "£", [51.74861, -0.33295],
    "Speciality coffee since 2008. They also run a coffee van at the station.", "", [], false],
  ["george-street-canteen", "George Street Canteen", "coffee", "George Street", "9A George Street", "£", [51.75134, -0.34228],
    "A family-run café with British and Mediterranean breakfasts and lunches.", "", [], false],
  ["morning-affairs", "Morning Affairs", "coffee", "Holywell Hill", "20 Holywell Hill", "£", [51.75026, -0.34032],
    "Speciality coffee and all-day breakfast.", "", [], false],
  ["darlish", "Darlish", "coffee", "City centre", "Jubilee Square", "£", [51.75185, -0.33667],
    "Persian ice cream made by hand in St Albans, plus Turkish coffee and Persian tea.", "Rhubarb, pomegranate and rose, or the vegan coconut and raspberry-rhubarb sorbet.", ["Ice cream"], false],

  // ── Bars and pubs ─────────────────────────────────────────────────────
  ["sucker-punch", "Sucker Punch", "drinks", "George Street", "26A George Street", "", [51.75146, -0.34165],
    "The cocktail bar to beat in St Albans, with a seasonal menu.", "Something off the seasonal list.", ["Book ahead", "Cocktails"], true, true],
  ["bishops-cave", "The Bishop's Cave", "drinks", "Holywell Hill", "Holywell Hill", "", [51.74996, -0.3402],
    "The city's first cheese, wine and craft beer shop and bar; The Gin Cave next door has more than 70 gins.", "A cheese board with an English pinot noir.", ["Cheese"], false],
  ["mad-squirrel", "Mad Squirrel Tap", "drinks", "City centre", "17 Heritage Close, High Street", "", [51.75077, -0.34139],
    "Craft beer, and probably the best garden for a view of the cathedral.", "A Mad Squirrel pilsner in the garden.", ["Beer garden"], false],
  ["fighting-cocks", "Ye Olde Fighting Cocks", "drinks", "Abbey Mill Lane", "16 Abbey Mill Lane", "", [51.74899, -0.34689],
    "One of the oldest pubs in St Albans, with roots in the 11th century.", "", ["Historic"], false],
  ["lower-red-lion", "Lower Red Lion", "drinks", "Fishpool Street", "36 Fishpool Street", "", [51.75173, -0.3465],
    "A traditional real ale pub, with a wind-up gramophone in the lounge.", "A cask ale.", [], false],
  ["six-bells", "The Six Bells", "drinks", "St Michael's", "16–18 St Michael's Street", "", [51.75372, -0.35422],
    "A cosy, old-fashioned pub by Verulamium Park, for pub food and real ale.", "", [], false],
  ["king-harry", "King Harry", "drinks", "Verulamium", "2 King Harry Lane", "", [51.74199, -0.34926],
    "A short stroll from Verulamium Park: cask ales, a beer garden and an open fire.", "The Sunday roast set menu.", ["Sunday roast"], false],
  ["prae-wood", "The Prae Wood Arms", "drinks", "Gorhambury", "Redbourn Road", "", [51.76159, -0.3639],
    "A big, airy country pub from 1838, a walk away through the Gorhambury Estate. Look out for Paddy, the pub cat.", "Braised shoulder of lamb, and a Side Pocket for a Toad ale.", ["Country pub"], false],
  ["cosy-club", "Cosy Club", "drinks", "Christopher Place", "15–17 Christopher Place", "", [51.75214, -0.34063],
    "A restaurant bar for brunch through cocktails, with vegan, gluten-free and children's menus.", "The bottomless brunch.", ["Dog-friendly"], false],
].map(([id, name, kind, area, addr, price, [lat, lng], blurb, order, tags, book, approx]) => ({
  id: "stalbans-" + id, city: "stalbans", name, kind, area, addr, price, lat, lng, blurb, order, tags,
  book: !!book, approx: !!approx, q: `${name}, ${addr}, St Albans, UK`,
})));
