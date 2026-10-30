// Pour Decisions — place data, transcribed from the guide
// "Coffee & restaurants, right now — San Francisco, 31 October – 3 November 2026"
// (prepared 30 October 2026).
//
// hours:  weekly hours by weekday, only where the guide states them.
//         "HH:MM-HH:MM" (comma-separated for split service), "closed",
//         or "?-HH:MM" when only the closing time is known. A missing day
//         means the guide does not say.
// dates:  overrides for specific dates in the trip window (holiday notices etc).
// q:      the guide's own Google Maps search text for the place.
// approx: true when the guide gives only a neighbourhood, so the pin is
//         placed from map data and may be a block or two off.

window.TRIP = {
  start: "2026-10-31",
  end: "2026-11-03",
  base: { name: "SoMa", lat: 37.7765, lng: -122.4060 },
};

const DAILY = (h) => ({ sun: h, mon: h, tue: h, wed: h, thu: h, fri: h, sat: h });

window.PLACES = [
  // ── Coffee: the purists ────────────────────────────────────────────────
  {
    id: "saint-frank", name: "Saint Frank Coffee", kind: "coffee", group: "Purist coffee",
    area: "Russian Hill", addr: "2340 Polk St", price: "$",
    blurb: "Bright, minimal, gallery-like, with high ceilings and direct-trade sourcing. Reviewers call the cortado among the best they've tried.",
    order: "Single-origin espresso or pour-over first, then the orange cream latte. The coffee flight shows off several beans at once.",
    tags: ["Laptop-friendly on weekdays"],
    hours: DAILY("07:00-18:00"),
    q: "Saint Frank Coffee, 2340 Polk St, San Francisco, CA",
  },
  {
    id: "coffee-movement", name: "The Coffee Movement", kind: "coffee", group: "Purist coffee",
    area: "Chinatown / Nob Hill", addr: "1030 Washington St", price: "$",
    blurb: "Tiny and takeaway-focused, near the Powell–Hyde cable car. Called the best coffee in the city in more than one review.",
    order: "Cocoa cappuccino, orange cream latte or espresso tonic. Or a tasting flight: one coffee prepared three ways.",
    tags: ["Takeaway"],
    hours: { mon: "07:00-14:00", tue: "07:00-14:00", wed: "07:00-14:00", thu: "07:00-14:00", fri: "07:00-16:00", sat: "07:00-16:00", sun: "07:00-16:00" },
    warn: "Hours conflict: listings say Mon–Thu 7am–2pm and Fri–Sun 7am–4pm; the shop's own site says 7am–4pm daily. Check the site the morning you go.",
    q: "The Coffee Movement, 1030 Washington St, San Francisco, CA",
  },
  {
    id: "sightglass-soma", name: "Sightglass Coffee", kind: "coffee", group: "Purist coffee",
    area: "SoMa", addr: "270 7th St", price: "$",
    blurb: "The flagship: a vast, light-filled roastery-cafe where you can watch beans being roasted. Clean, balanced espresso and thoughtful single origins.",
    order: "Espresso, then a single origin.",
    tags: ["No Wi-Fi", "Near your base"],
    hours: { sun: "07:00-17:00", mon: "06:30-17:00", tue: "06:30-17:00", wed: "06:30-17:00", thu: "06:30-17:00", fri: "06:30-17:00" },
    q: "Sightglass Coffee, 270 7th St, San Francisco, CA",
  },
  {
    id: "sightglass-divis", name: "Sightglass Divisadero", kind: "coffee", group: "Purist coffee",
    area: "Divisadero", addr: "301 Divisadero St", price: "$",
    blurb: "Sightglass in a Victorian: the more neighbourhood of its shops. Same clean, balanced espresso.",
    order: "Espresso or a single-origin pour-over.",
    tags: ["No Wi-Fi"],
    hours: { sun: "07:00-17:00", mon: "06:30-17:00", tue: "06:30-17:00", wed: "06:30-17:00", thu: "06:30-17:00", fri: "06:30-17:00" },
    q: "Sightglass Coffee, 301 Divisadero St, San Francisco, CA",
  },
  {
    id: "sightglass-mission", name: "Sightglass Mission", kind: "coffee", group: "Purist coffee",
    area: "Mission", addr: "3014 20th St", price: "$",
    blurb: "The Mission outpost; the guide says it keeps hours similar to the other Sightglass shops. Last stop on the Valencia coffee crawl.",
    order: "Espresso or a single-origin pour-over.",
    tags: ["No Wi-Fi"],
    hoursNote: "Similar to the other Sightglass shops (around 7am–5pm). Not confirmed.",
    q: "Sightglass Coffee, 3014 20th St, San Francisco, CA",
  },
  {
    id: "ritual-valencia", name: "Ritual Coffee Roasters", kind: "coffee", group: "Purist coffee",
    area: "Mission", addr: "1026 Valencia St", price: "$",
    blurb: "Founded on Valencia in 2005: one of the city's founding third-wave roasters, woman-owned and still independent. Bright, fruit-forward roasts.",
    order: "Whatever single origin is freshest. Pair it with Four Barrel two blocks away.",
    tags: [],
    hours: { sun: "06:30-20:00", mon: "06:30-19:00", tue: "06:30-19:00" },
    q: "Ritual Coffee Roasters, 1026 Valencia St, San Francisco, CA",
  },
  {
    id: "ritual-hayes", name: "Ritual Hayes Valley", kind: "coffee", group: "Purist coffee",
    area: "Hayes Valley", addr: "432 Octavia Blvd", price: "$",
    blurb: "Ritual's container shop in Hayes Valley. A handy stop before dinner in Hayes.",
    order: "A bright, fruit-forward single origin.",
    tags: [],
    hoursNote: "Check this shop's hours separately; the guide doesn't list them.",
    q: "Ritual Coffee Roasters, 432 Octavia Blvd, San Francisco, CA",
  },
  {
    id: "wrecking-ball", name: "Wrecking Ball Coffee Roasters", kind: "coffee", group: "Purist coffee",
    area: "Cow Hollow", addr: "2271 Union St", price: "$",
    blurb: "Founded by Trish Rothgeb, who coined the term “third wave” for coffee. Small, precise, serious about single origins. Look for the pineapple wallpaper.",
    order: "Espresso citron tonic, or the oat-milk latte reviewers single out.",
    tags: [],
    hours: { mon: "07:00-16:00", tue: "07:00-16:00", wed: "07:00-16:00", thu: "07:00-16:00", fri: "07:00-16:00", sat: "08:00-16:00", sun: "08:00-16:00" },
    q: "Wrecking Ball Coffee Roasters, 2271 Union St, San Francisco, CA",
  },
  {
    id: "four-barrel", name: "Four Barrel Coffee", kind: "coffee", group: "Purist coffee",
    area: "Mission", addr: "375 Valencia St", price: "$",
    blurb: "Valencia's other founding roaster: no Wi-Fi, no outlets, no syrups. Just coffee, taken seriously.",
    order: "Fruit-forward naturals and experimental microlots.",
    tags: ["No Wi-Fi"],
    hours: DAILY("07:00-17:00"),
    q: "Four Barrel Coffee, 375 Valencia St, San Francisco, CA",
  },

  // ── Coffee: the character stops ────────────────────────────────────────
  {
    id: "blue-bottle-linden", name: "Blue Bottle (Linden St)", kind: "coffee", group: "Character coffee",
    area: "Hayes Valley", addr: "315 Linden St", price: "$",
    blurb: "The charming alley-side kiosk, Blue Bottle's original Hayes stop. The brand began at the Ferry Building farmers market.",
    order: "New Orleans iced coffee or a pour-over.",
    tags: ["Kiosk"],
    q: "Blue Bottle Coffee, 315 Linden St, San Francisco, CA",
  },
  {
    id: "blue-bottle-sutter", name: "Blue Bottle (Sutter St)", kind: "coffee", group: "Character coffee",
    area: "Union Square", addr: "199 Sutter St", price: "$",
    blurb: "The central, easy Blue Bottle.",
    order: "New Orleans iced coffee or a pour-over.",
    tags: [],
    q: "Blue Bottle Coffee, 199 Sutter St, San Francisco, CA",
  },
  {
    id: "tartine-manufactory", name: "Tartine Manufactory", kind: "coffee", group: "Character coffee",
    area: "Potrero Hill", addr: "595 Alabama St", price: "$",
    blurb: "Bakery, cafe and restaurant in one vast industrial space. Bread and pastries are the main event; the coffee is properly third-wave.",
    order: "Come hungry: pastries and bread first, coffee alongside.",
    tags: ["Laptop-friendly"],
    hours: { mon: "?-16:00" },
    hoursNote: "Monday closes at 4pm, earlier than other days.",
    q: "Tartine Manufactory, 595 Alabama St, San Francisco, CA",
  },
  {
    id: "andytown", name: "Andytown Coffee Roasters", kind: "coffee", group: "Character coffee",
    area: "Outer Sunset", addr: "3655 Lawton St", price: "$",
    blurb: "A trek to the Outer Sunset that reviewers say earns it: ocean air and a beloved neighbourhood institution. Walk on to Ocean Beach.",
    order: "The Snowy Plover.",
    tags: ["Worth the trip"],
    hours: DAILY("07:00-17:00"),
    q: "Andytown Coffee Roasters, 3655 Lawton St, San Francisco, CA",
  },
  {
    id: "telescope", name: "Telescope Coffee", kind: "coffee", group: "Character coffee",
    area: "SoMa", addr: "345 6th St", price: "$",
    blurb: "A smaller, roaster-led SoMa stop: excellent coffee without the flagship crowds. A short walk from Sightglass on 7th.",
    order: "Ask what's freshest.",
    tags: ["Near your base"],
    q: "Telescope Coffee, 345 6th St, San Francisco, CA",
  },
  {
    id: "linea", name: "Linea Caffe", kind: "coffee", group: "Character coffee",
    area: "Potrero Hill", addr: "1125 Mariposa St", price: "$",
    blurb: "Roastery-cafe with a quiet, design-led room. Eater keeps naming it alongside Saint Frank and The Coffee Movement.",
    order: "A precise pour-over.",
    tags: [],
    q: "Linea Caffe, 1125 Mariposa St, San Francisco, CA",
  },
  {
    id: "equator-roundhouse", name: "Equator Coffees, Round House", kind: "coffee", group: "Character coffee",
    area: "Golden Gate Bridge", addr: "Golden Gate Bridge Plaza", price: "$",
    blurb: "A 1930s Art Deco diner on the city side of the Golden Gate Bridge. Go for the view with the coffee.",
    order: "Single-origin pour-over.",
    tags: ["Bridge views"],
    q: "Equator Coffees, Round House, Golden Gate Bridge Plaza, San Francisco, CA",
  },

  // ── Restaurants: book ahead ────────────────────────────────────────────
  {
    id: "state-bird", name: "State Bird Provisions", kind: "food", group: "Book ahead",
    area: "Fillmore", addr: "1529 Fillmore St", price: "$$$",
    blurb: "Dim-sum-style carts of inventive California small plates. Michelin-starred, loud and joyful.",
    order: "The fried quail that named the place, sourdough sauerkraut pancakes, pork-belly salad.",
    tags: ["Book ahead"], book: true,
    hours: { sun: "17:30-22:00", mon: "17:30-22:00", tue: "17:30-22:00", wed: "17:30-22:00", thu: "17:30-22:00", fri: "17:30-22:30", sat: "17:30-22:30" },
    dates: { "2026-11-03": "closed" },
    warn: "Closed Tuesday 3 November. The Progress next door is the fallback.",
    q: "State Bird Provisions, 1529 Fillmore St, San Francisco, CA",
  },
  {
    id: "the-progress", name: "The Progress", kind: "food", group: "Book ahead", eater38: true,
    area: "Fillmore", addr: "1525 Fillmore St", price: "$$$",
    blurb: "State Bird's sibling next door, built for sharing.",
    order: "Caviar potato cloud, brown-butter seaweed noodles, Liberty Farms half-duck with fried rice.",
    tags: ["Book ahead"], book: true,
    hours: DAILY("17:30-22:00"),
    q: "The Progress, 1525 Fillmore St, San Francisco, CA",
  },
  {
    id: "mister-jius", name: "Mister Jiu's", kind: "food", group: "Book ahead",
    area: "Chinatown", addr: "28 Waverly Pl", price: "$$$",
    blurb: "Contemporary Chinese tasting menus, Michelin-starred.",
    order: "Pre-order the Peking-style duck. Sourdough scallion pancake.",
    tags: ["Book ahead", "Pre-order the duck"], book: true,
    hours: { sun: "closed", mon: "closed", tue: "17:00-22:00", wed: "17:00-22:00", thu: "17:00-22:00", fri: "17:00-22:00", sat: "17:00-22:00" },
    warn: "Tue–Sat only. On this trip: Saturday 31 Oct or Tuesday 3 Nov.",
    q: "Mister Jiu's, 28 Waverly Pl, San Francisco, CA",
  },
  {
    id: "four-kings", name: "Four Kings", kind: "food", group: "Book ahead", eater38: true,
    area: "Chinatown", addr: "710 Commercial St", price: "$$$",
    blurb: "Modern Cantonese in a 1990s Hong Kong mood.",
    order: "Dry-aged fried squab, XO escargot with milk bread, and the mapo spaghetti reviewers insist on.",
    tags: ["Reservations essential"], book: true,
    hours: { mon: "closed", tue: "closed", wed: "closed", thu: "17:30-23:00", fri: "17:30-23:00", sat: "17:30-23:00", sun: "17:30-23:00" },
    warn: "Thu–Sun only. On this trip: Saturday 31 Oct or Sunday 1 Nov. Later seatings are easier to get.",
    q: "Four Kings, 710 Commercial St, San Francisco, CA",
  },
  {
    id: "happy-crane", name: "The Happy Crane", kind: "food", group: "Book ahead",
    area: "Hayes Valley", addr: "451 Gough St", price: "$$$",
    blurb: "The most talked-about opening of 2025: contemporary Chinese from chef James Parry, on Eater's national 15 Best New Restaurants list.",
    order: "Firecracker shrimp, crab rice roll (cut tableside with scissors), oyster pancake.",
    tags: ["Book well ahead"], book: true,
    hours: { sun: "closed", mon: "closed", tue: "17:00-21:00", wed: "17:00-21:00", thu: "17:00-21:00", fri: "17:00-21:00", sat: "17:00-21:00" },
    warn: "Tue–Sat only. On this trip: Saturday 31 Oct or Tuesday 3 Nov.",
    q: "The Happy Crane, 451 Gough St, San Francisco, CA",
  },
  {
    id: "californios", name: "Californios", kind: "food", group: "Book ahead", eater38: true,
    area: "SoMa", addr: "355 11th St", price: "$$$",
    blurb: "Two-Michelin-star Mexican tasting menu, California through and through. The splurge of the trip; allow a full evening.",
    order: "Bluefin tuna tostada, mushroom taco, and the banana-and-caviar course.",
    tags: ["Book ahead", "Splurge"], book: true,
    hours: { sun: "closed", mon: "closed", tue: "17:00-22:00", wed: "17:00-22:00", thu: "17:00-22:00", fri: "17:00-22:00", sat: "17:00-22:00" },
    q: "Californios, 355 11th St, San Francisco, CA",
  },
  {
    id: "maria-isabel", name: "Maria Isabel", kind: "food", group: "Book ahead", eater38: true,
    area: "Presidio Heights", addr: "500 Presidio Ave", price: "$$$",
    blurb: "New to Eater's October update, from the Dalida team: personal, heirloom-corn Mexican named for the chef's mother and sister. Small and intimate.",
    order: "Duck carnitas enmolada with four moles, Dungeness crab tortita ahogada, skinny churros.",
    tags: ["Book ahead"], book: true,
    hours: { sun: "closed", mon: "closed", tue: "17:00-21:00", wed: "17:00-21:00", thu: "17:00-21:00", fri: "17:00-21:00", sat: "17:00-21:00" },
    hoursNote: "Dinner from 5pm until 9 or 9:30pm.",
    q: "Maria Isabel, 500 Presidio Ave, San Francisco, CA",
  },
  {
    id: "zuni", name: "Zuni Cafe", kind: "food", group: "Book ahead", eater38: true,
    area: "Market St", addr: "1658 Market St", price: "$$",
    blurb: "The brick-oven roast chicken for two over warm bread salad is one of San Francisco's defining dishes.",
    order: "Roast chicken for two, oysters, Caesar, shoestring potatoes.",
    tags: ["Book ahead"], book: true,
    hours: { mon: "closed", tue: "17:00-21:30", wed: "17:00-21:30", thu: "17:00-21:30", fri: "11:00-15:00,17:00-21:30", sat: "11:00-15:00,17:00-21:30", sun: "11:00-15:00,17:00-21:30" },
    q: "Zuni Cafe, 1658 Market St, San Francisco, CA",
  },

  // ── Restaurants: walk in, neighbourhood, daytime ───────────────────────
  {
    id: "jules", name: "Jules", kind: "food", group: "Walk in", eater38: true,
    area: "Lower Haight", addr: "", price: "$$", approx: true,
    blurb: "A 42-seat sourdough pizza room that Eater and The Infatuation rate among the city's best new spots. The crust is the point.",
    order: "Margherita first, then a second pie to share.",
    tags: ["Expect a wait"],
    hoursNote: "Go early or late to avoid the peak wait.",
    q: "Jules, Lower Haight, San Francisco, CA",
  },
  {
    id: "lunette", name: "Lunette", kind: "food", group: "Walk in", eater38: true,
    area: "Ferry Building", addr: "Ferry Building, Suite 33/47", price: "$–$$",
    blurb: "Chef Nite Yun's Cambodian noodle and rice dishes. Pair with a Ferry Building wander.",
    order: "Kuy teav Phnom Penh (pork noodle soup), prahok ktiss, Khmer fried chicken wings.",
    tags: [],
    hours: { sun: "11:00-14:30", mon: "closed", tue: "11:00-20:00", wed: "11:00-20:00", thu: "11:00-20:00", fri: "11:00-20:00", sat: "10:00-20:00" },
    q: "Lunette, Ferry Building, Suite 33/47, San Francisco, CA",
  },
  {
    id: "golden-boy", name: "Golden Boy Pizza", kind: "food", group: "Walk in", eater38: true,
    area: "North Beach", addr: "542 Green St", price: "$",
    blurb: "Square, focaccia-style slices eaten standing up. Exactly right after a walk through Chinatown.",
    order: "A couple of square slices.",
    tags: ["Cash-friendly", "Fast"],
    q: "Golden Boy Pizza, 542 Green St, San Francisco, CA",
  },
  {
    id: "outta-sight", name: "Outta Sight Pizza", kind: "food", group: "Walk in", eater38: true,
    area: "Larkin St", addr: "Larkin St", price: "$$", approx: true,
    blurb: "Eater's other pizza pick: Detroit- and New York-leaning pies in a lively room. The move when Jules has a long wait.",
    order: "A Detroit-style square pie.",
    tags: [],
    q: "Outta Sight Pizza, Larkin St, San Francisco, CA",
  },
  {
    id: "breadbelly", name: "Breadbelly", kind: "bakery", group: "Walk in", eater38: true,
    area: "Richmond", addr: "", price: "$", approx: true,
    blurb: "Filipino-leaning bakery-cafe: ube, calamansi and pandan pastries alongside excellent coffee.",
    order: "Go in the morning, before the best pastries sell out. Then Cinderella Bakery nearby.",
    tags: ["Mornings"],
    q: "Breadbelly, Richmond, San Francisco, CA",
  },
  {
    id: "cinderella", name: "Cinderella Bakery", kind: "bakery", group: "Walk in", eater38: true,
    area: "Richmond", addr: "", price: "$", approx: true,
    blurb: "Russian baking in the Richmond. Pairs with Breadbelly.",
    order: "Piroshki.",
    tags: [],
    q: "Cinderella Bakery, Richmond, San Francisco, CA",
  },
  {
    id: "swan", name: "Swan Oyster Depot", kind: "food", group: "Walk in",
    area: "Polk Gulch", addr: "1517 Polk St", price: "$–$$",
    blurb: "An 18-seat marble counter since 1912. No reservations.",
    order: "Dungeness crab back, Sicilian sashimi, Boston clam chowder, oysters.",
    tags: ["Cash only", "Line"],
    hours: { sun: "closed", mon: "08:00-14:30", tue: "08:00-14:30", wed: "08:00-14:30", thu: "08:00-14:30", fri: "08:00-14:30", sat: "08:00-14:30" },
    hoursNote: "Arrive before 11:30am or after 1:30pm to dodge the worst of the line.",
    q: "Swan Oyster Depot, 1517 Polk St, San Francisco, CA",
  },
  {
    id: "anchor-oyster", name: "Anchor Oyster Bar", kind: "food", group: "Walk in", eater38: true,
    area: "Castro", addr: "579 Castro St", price: "$$",
    blurb: "A tiny Castro seafood bar and fish market since 1977. No reservations: add your name to the whiteboard.",
    order: "Cioppino (reviewers call it the city's best), clam chowder, crab cakes, steamed clams.",
    tags: ["Whiteboard waitlist"],
    hours: { sun: "14:00-20:00", mon: "14:00-20:00", tue: "closed", wed: "closed", thu: "14:00-20:00", fri: "14:00-20:00", sat: "14:00-20:00" },
    dateWarn: { "2026-10-31": "The Castro is closed to traffic for Halloween from 11am." },
    q: "Anchor Oyster Bar, 579 Castro St, San Francisco, CA",
  },

  // ── The Mission, in a few blocks ───────────────────────────────────────
  {
    id: "delfina", name: "Delfina", kind: "food", group: "Mission", eater38: true,
    area: "Mission", addr: "3621 18th St", price: "$$",
    blurb: "Handmade Cal-Italian pasta.",
    order: "The pasta.",
    tags: [],
    hours: { sun: "17:00-21:00", mon: "17:15-22:00", tue: "17:15-22:00", wed: "17:15-22:00", thu: "17:15-22:00", fri: "17:15-22:00", sat: "17:15-22:00" },
    q: "Delfina, 3621 18th St, San Francisco, CA",
  },
  {
    id: "rintaro", name: "Rintaro", kind: "food", group: "Mission", eater38: true,
    area: "Mission", addr: "", price: "", approx: true,
    blurb: "A quiet izakaya.", order: "", tags: ["Book ahead"], book: true,
    q: "Rintaro, Mission, San Francisco, CA",
  },
  {
    id: "prubechu", name: "Prubechu", kind: "food", group: "Mission", eater38: true,
    area: "Mission", addr: "", price: "", approx: true,
    blurb: "Chamorro cooking.", order: "", tags: [],
    q: "Prubechu, Mission, San Francisco, CA",
  },
  {
    id: "taqueria-cancun", name: "Taqueria Cancun", kind: "food", group: "Mission", eater38: true,
    area: "Mission", addr: "2288 Mission St", price: "$",
    blurb: "Classic Mission burritos.", order: "A burrito.", tags: [],
    q: "Taqueria Cancun, 2288 Mission St, San Francisco, CA",
  },
  {
    id: "true-laurel", name: "True Laurel", kind: "drinks", group: "Mission", eater38: true,
    area: "Mission", addr: "753 Alabama St", price: "",
    blurb: "Cocktails.", order: "", tags: [],
    q: "True Laurel, 753 Alabama St, San Francisco, CA",
  },
  {
    id: "trick-dog", name: "Trick Dog", kind: "drinks", group: "Mission", eater38: true,
    area: "Mission", addr: "3010 20th St", price: "",
    blurb: "Playful cocktails.", order: "", tags: [],
    q: "Trick Dog, 3010 20th St, San Francisco, CA",
  },
  {
    id: "piglet", name: "Piglet & Co", kind: "food", group: "Eater 38", eater38: true,
    area: "Mission", addr: "", price: "", approx: true,
    blurb: "Taiwanese.", order: "", tags: [],
    q: "Piglet & Co, Mission, San Francisco, CA",
  },
  {
    id: "lazy-bear", name: "Lazy Bear", kind: "food", group: "Eater 38", eater38: true,
    area: "Mission", addr: "", price: "$$$", approx: true,
    blurb: "Tasting menu.", order: "", tags: ["Book far ahead"], book: true,
    q: "Lazy Bear, Mission, San Francisco, CA",
  },

  // ── More Eater 38, by neighbourhood ────────────────────────────────────
  {
    id: "quince", name: "Quince", kind: "food", group: "Eater 38", eater38: true,
    area: "Jackson Square", addr: "470 Pacific Ave", price: "$$$",
    blurb: "Fine dining.", order: "", tags: ["Book ahead"], book: true,
    q: "Quince, 470 Pacific Ave, San Francisco, CA",
  },
  {
    id: "bix", name: "Bix", kind: "food", group: "Eater 38", eater38: true,
    area: "Jackson Square", addr: "56 Gold St", price: "",
    blurb: "Classic American.", order: "", tags: [],
    q: "Bix, 56 Gold St, San Francisco, CA",
  },
  {
    id: "dalida", name: "Dalida", kind: "food", group: "Eater 38", eater38: true,
    area: "Presidio", addr: "Tunnel Tops area", price: "", approx: true,
    blurb: "Mediterranean, near the Presidio Tunnel Tops.", order: "", tags: [],
    q: "Dalida, Presidio, Tunnel Tops area, San Francisco, CA",
  },
  {
    id: "house-of-prime-rib", name: "House of Prime Rib", kind: "food", group: "Eater 38", eater38: true,
    area: "Nob Hill", addr: "1906 Van Ness Ave", price: "",
    blurb: "The prime rib institution.", order: "Prime rib.", tags: ["Book ahead"], book: true,
    q: "House of Prime Rib, 1906 Van Ness Ave, San Francisco, CA",
  },
  {
    id: "naides", name: "Restaurant Naides", kind: "food", group: "Eater 38", eater38: true,
    area: "Nob Hill", addr: "", price: "", approx: true,
    blurb: "Filipino.", order: "", tags: [],
    q: "Restaurant Naides, Nob Hill, San Francisco, CA",
  },
  {
    id: "mandalay", name: "Mandalay", kind: "food", group: "Eater 38", eater38: true,
    area: "Inner Richmond", addr: "", price: "", approx: true,
    blurb: "Burmese.", order: "Tea-leaf salad and mohinga.", tags: [],
    q: "Mandalay, Inner Richmond, San Francisco, CA",
  },
  {
    id: "kin-khao", name: "Kin Khao", kind: "food", group: "Eater 38", eater38: true,
    area: "Union Square", addr: "", price: "", approx: true,
    blurb: "Thai, lively and spicy.", order: "", tags: [],
    q: "Kin Khao, Union Square, San Francisco, CA",
  },
  {
    id: "dingles", name: "Dingles Public House", kind: "drinks", group: "Eater 38", eater38: true,
    area: "Hayes Valley", addr: "", price: "", approx: true,
    blurb: "British pub.", order: "", tags: [],
    q: "Dingles Public House, Hayes Valley, San Francisco, CA",
  },
  {
    id: "thanh-long", name: "Thanh Long", kind: "food", group: "Eater 38", eater38: true,
    area: "Outer Sunset", addr: "4101 Judah St", price: "",
    blurb: "Garlic Dungeness crab. Pair with Andytown.", order: "Garlic Dungeness crab.", tags: [],
    q: "Thanh Long, 4101 Judah St, San Francisco, CA",
  },
  {
    id: "the-morris", name: "The Morris", kind: "food", group: "Eater 38", eater38: true,
    area: "Potrero Hill", addr: "", price: "", approx: true,
    blurb: "Smoked meats.", order: "", tags: [],
    q: "The Morris, Potrero Hill, San Francisco, CA",
  },
  {
    id: "sohn", name: "Sōhn", kind: "food", group: "Eater 38", eater38: true,
    area: "Dogpatch", addr: "", price: "", approx: true,
    blurb: "Korean cafe.", order: "", tags: [],
    q: "Sōhn, Dogpatch, San Francisco, CA",
  },
  {
    id: "old-mandarin", name: "Old Mandarin Islamic Restaurant", kind: "food", group: "Eater 38", eater38: true,
    area: "Parkside", addr: "", price: "", approx: true,
    blurb: "Northern Chinese Islamic cooking.", order: "", tags: [],
    q: "Old Mandarin Islamic Restaurant, Parkside, San Francisco, CA",
  },
  {
    id: "la-cigale", name: "La Cigale", kind: "food", group: "Eater 38", eater38: true,
    area: "Glen Park", addr: "", price: "", approx: true,
    blurb: "Occitan. New to Eater's October update.", order: "", tags: [],
    q: "La Cigale, Glen Park, San Francisco, CA",
  },
  {
    id: "abaca", name: "Abacá", kind: "food", group: "Eater 38", eater38: true,
    area: "Fisherman's Wharf", addr: "", price: "", approx: true,
    blurb: "Filipino.", order: "", tags: [],
    q: "Abacá, Fisherman's Wharf, San Francisco, CA",
  },
  {
    id: "beit-rima", name: "Beit Rima", kind: "food", group: "Eater 38", eater38: true,
    area: "Cole Valley", addr: "", price: "", approx: true,
    blurb: "Arabic.", order: "", tags: [],
    q: "Beit Rima, Cole Valley, San Francisco, CA",
  },
  {
    id: "fikscue", name: "Fikscue Thrive City", kind: "food", group: "Eater 38", eater38: true,
    area: "Mission Bay", addr: "Thrive City", price: "", approx: true,
    blurb: "BBQ.", order: "", tags: [],
    q: "Fikscue Thrive City, Mission Bay, San Francisco, CA",
  },
  {
    id: "yo-tambien", name: "Yo También Cantina", kind: "food", group: "Eater 38", eater38: true,
    area: "Inner Sunset", addr: "", price: "", approx: true,
    blurb: "New to Eater's October update.", order: "", tags: [],
    q: "Yo También Cantina, Inner Sunset, San Francisco, CA",
  },

  // ── Outside the 38, flagged in the guide ───────────────────────────────
  {
    id: "verjus", name: "Verjus", kind: "drinks", group: "Wine bar",
    area: "Jackson Square", addr: "550 Washington St", price: "",
    blurb: "French wine bar.",
    order: "The pain perdu with vanilla ice cream is the dessert reviewers name first.",
    tags: [],
    hours: { sat: "11:30-23:00", sun: "closed", mon: "closed", tue: "16:00-22:00" },
    q: "Verjus, 550 Washington St, San Francisco, CA",
  },
  {
    id: "joujou", name: "JouJou", kind: "food", group: "Brasserie",
    area: "SoMa / Mission Bay", addr: "65 Division St", price: "",
    blurb: "French brasserie from the Lazy Bear team, just south of SoMa.",
    order: "", tags: [],
    hours: { sun: "17:00-21:00", mon: "closed" },
    dates: { "2026-10-31": "closed" },
    warn: "Closed Saturday 31 Oct (per its Tock notice).",
    q: "JouJou, 65 Division St, San Francisco, CA",
  },
];

// ── The plan: four days, each starting in SoMa ───────────────────────────
window.DAYS = [
  {
    date: "2026-10-31", label: "Sat 31 Oct", title: "North: Chinatown, Polk and Union",
    steps: [
      { k: "Start", text: "Coffee in SoMa", places: ["sightglass-soma"] },
      { k: "Go", text: "T Metro north to Chinatown, then transit uphill to Polk Street." },
      { k: "Coffee", text: "Polk, then Union", places: ["saint-frank", "wrecking-ball"] },
      { k: "Eat", text: "Chinatown dinner: Four Kings (5:30pm) or Mister Jiu's (5pm)", places: ["four-kings", "mister-jius"] },
    ],
    watch: [
      "JouJou is closed.",
      "The Castro is closed to traffic for Halloween from 11am.",
      "Verjus is open 11:30am–11pm.",
    ],
  },
  {
    date: "2026-11-01", label: "Sun 1 Nov", title: "East, then the Mission",
    steps: [
      { k: "Start", text: "Coffee in SoMa, then walk east to the Embarcadero", places: ["telescope"] },
      { k: "Go", text: "Lunch at the Ferry Building (11am–2:30pm), then BART from Embarcadero to 16th St Mission.", places: ["lunette"] },
      { k: "Coffee", text: "The Valencia crawl", places: ["ritual-valencia", "four-barrel", "sightglass-mission"] },
      { k: "Eat", text: "Delfina or Jules. JouJou (5–9pm) is just south of SoMa on the way back.", places: ["delfina", "jules", "joujou"] },
    ],
    watch: [
      "Swan Oyster Depot, Mister Jiu's and Verjus are closed.",
      "The Wharf and Marina are disrupted by the half marathon until about noon.",
      "Clocks go back an hour overnight (end of daylight saving).",
    ],
  },
  {
    date: "2026-11-02", label: "Mon 2 Nov", title: "West: Hayes Valley, Potrero Hill and the Castro",
    steps: [
      { k: "Start", text: "Coffee in SoMa", places: ["sightglass-soma"] },
      { k: "Go", text: "Muni Metro along Market Street to Civic Center, then walk to Hayes Valley." },
      { k: "Coffee", text: "Blue Bottle on Linden, then Tartine Manufactory before its 4pm Monday close", places: ["blue-bottle-linden", "tartine-manufactory"] },
      { k: "Eat", text: "Anchor Oyster Bar in the Castro (2–8pm), then The Progress on Fillmore for dinner", places: ["anchor-oyster", "the-progress"] },
    ],
    watch: [
      "Zuni, Mister Jiu's, Verjus and JouJou are all closed.",
      "Día de los Muertos procession from 7pm in the Mission.",
    ],
  },
  {
    date: "2026-11-03", label: "Tue 3 Nov", title: "One last trip north, kept light",
    steps: [
      { k: "Start", text: "Coffee in SoMa", places: ["sightglass-soma"] },
      { k: "Go", text: "T Metro north to Chinatown for The Coffee Movement (re-check its hours in the morning).", places: ["coffee-movement"] },
      { k: "Eat", text: "Mister Jiu's in Chinatown, or The Happy Crane in Hayes Valley", places: ["mister-jius", "happy-crane"] },
    ],
    watch: [
      "State Bird Provisions and Anchor Oyster Bar are closed.",
      "Verjus, also on Washington Street, is open 4–10pm.",
    ],
  },
];

// ── Coordinates ──────────────────────────────────────────────────────────
// Geocoded from OpenStreetMap (Nominatim) on 30 Oct 2026 against the guide's
// address, or the business name where the guide gives only a neighbourhood.
const COORDS = {
  "saint-frank": [37.79849, -122.42205], "coffee-movement": [37.79481, -122.41032],
  "sightglass-soma": [37.77703, -122.40844], "sightglass-divis": [37.77230, -122.43742],
  "sightglass-mission": [37.75920, -122.41099], "ritual-valencia": [37.75643, -122.42138],
  "ritual-hayes": [37.77639, -122.42418], "wrecking-ball": [37.79682, -122.43664],
  "four-barrel": [37.76702, -122.42193], "blue-bottle-linden": [37.77631, -122.42326],
  "blue-bottle-sutter": [37.78974, -122.40370], "tartine-manufactory": [37.76177, -122.41180],
  "andytown": [37.75672, -122.50232], "telescope": [37.77759, -122.40432],
  "linea": [37.76366, -122.39514], "equator-roundhouse": [37.80778, -122.47568],
  "state-bird": [37.78371, -122.43295], "the-progress": [37.78350, -122.43301],
  "mister-jius": [37.79372, -122.40666], "four-kings": [37.79410, -122.40508],
  "happy-crane": [37.77746, -122.42323], "californios": [37.77128, -122.41305],
  "maria-isabel": [37.78712, -122.44662], "zuni": [37.77356, -122.42165],
  "jules": [37.77178, -122.43052], "lunette": [37.79509, -122.39303],
  "golden-boy": [37.79973, -122.40808], "outta-sight": [37.78184, -122.41711],
  "breadbelly": [37.78262, -122.47441], "cinderella": [37.77737, -122.46372],
  "swan": [37.79097, -122.42092], "anchor-oyster": [37.75970, -122.43475],
  "delfina": [37.76141, -122.42434], "rintaro": [37.76889, -122.41513],
  "prubechu": [37.76133, -122.41950], "taqueria-cancun": [37.76046, -122.41940],
  "true-laurel": [37.75950, -122.41149], "trick-dog": [37.75922, -122.41119],
  "piglet": [37.76000, -122.41800], "lazy-bear": [37.76032, -122.41977],
  "quince": [37.79743, -122.40327], "bix": [37.79685, -122.40293],
  "dalida": [37.79981, -122.45976], "house-of-prime-rib": [37.79339, -122.42254],
  "naides": [37.79300, -122.41610], "mandalay": [37.78522, -122.46433],
  "kin-khao": [37.78503, -122.40927], "dingles": [37.77650, -122.42450],
  "thanh-long": [37.76029, -122.50607], "the-morris": [37.76296, -122.40853],
  "sohn": [37.75736, -122.38804], "old-mandarin": [37.73833, -122.50070],
  "la-cigale": [37.73440, -122.43344], "abaca": [37.80590, -122.41700],
  "beit-rima": [37.76595, -122.44967], "fikscue": [37.76800, -122.38780],
  "yo-tambien": [37.76515, -122.46021], "verjus": [37.79582, -122.40253],
  "joujou": [37.76966, -122.40379],
};

// Street addresses the guide leaves out, taken from the same map data.
// Shown with a "from map data" note; the Google Maps link still searches the guide's text.
const MAP_ADDR = {
  "jules": "237 Fillmore St", "outta-sight": "422 Larkin St", "breadbelly": "1408 Clement St",
  "cinderella": "436 Balboa St", "rintaro": "82 14th St", "prubechu": "2224 Mission St",
  "lazy-bear": "3416 19th St", "dalida": "Sheridan Ave, Presidio", "mandalay": "4348 California St",
  "kin-khao": "55 Cyril Magnin St", "the-morris": "2501 Mariposa St", "sohn": "2535 3rd St",
  "old-mandarin": "3132 Vicente St", "la-cigale": "679 Chenery St", "beit-rima": "86 Carl St",
  "yo-tambien": "205 Hugo St",
};

// No exact match in the map data: the pin marks the neighbourhood only.
const APPROX = new Set(["piglet", "naides", "dingles", "abaca", "fikscue"]);

for (const p of window.PLACES) {
  [p.lat, p.lng] = COORDS[p.id];
  if (MAP_ADDR[p.id]) { p.addr = MAP_ADDR[p.id]; p.addrFromMap = true; }
  p.approx = APPROX.has(p.id);
}
