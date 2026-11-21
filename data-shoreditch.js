// Stroll: Shoreditch, London.
// Picks from Time Out's best Shoreditch restaurants (revamped Jan 2026, with addresses, prices and
// some hours) and best Shoreditch bars (Sep 2026), The Infatuation's best Shoreditch bars (Jul 2025),
// olive's Shoreditch guide (Aug 2026) and London x London's café guide (updated Sep 2026),
// gathered 21 Nov 2026. Positions geocoded from OpenStreetMap and checked by hand.
// Hours are Time Out's, where it gave them; days it doesn't list show as "Not listed".
// Prices are Time Out's £ rating where it gave one, otherwise judged from its menu prices.

window.CITIES.shoreditch = {
  name: "Shoreditch", short: "Shoreditch", tz: "Europe/London",
  center: { lat: 51.5250, lng: -0.0790 },
  base: { name: "Shoreditch High Street station", lat: 51.52325, lng: -0.07447 },
  fit: 700, // frame the Shoreditch triangle; Spitalfields and Hoxton picks are a pinch away
  radius: 8000, // inner London; further out, walking times start from the station instead
  sources: "Time Out, The Infatuation, olive and London x London guides, gathered 21 Nov 2026",
};

{
  const TO_HOURS = "Hours from Time Out (Jan 2026). Days it doesn't list are probably closed; check before you go.";
  const H = (spec) => {
    // "mon-sat 12:00-15:00,18:00-23:00; sun 12:00-21:00" → { mon: "...", ... }
    const D = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"], out = {};
    for (const part of spec.split(";")) {
      const [days, times] = part.trim().split(" ");
      const [a, b = a] = days.split("-");
      for (let i = D.indexOf(a); i <= D.indexOf(b); i++) out[D[i]] = times;
    }
    return out;
  };

  window.PLACES.push(...[
    // ── Restaurants (Time Out's best Shoreditch restaurants, Jan 2026) ────
    ["legado", "Legado", "food", "Shoreditch High Street", "Unit 1C Montacute Yards", "££££", [51.52441, -0.07845],
      "Nieves Barragán Mohacho's regional Spanish cooking.", "Quisquillas de Cádiz, the Legado sandwich, then churros with saffron ice cream.", [], false, false,
      H("tue-sat 12:00-14:30,17:30-22:30")],
    ["bistro-freddie", "Bistro Freddie", "food", "Luke Street", "74 Luke Street", "£££", [51.52417, -0.08158],
      "A French-ish neighbourhood bistro with about 45 covers.", "House sausage with brown sauce, or snails on flatbread.", [], false, false,
      H("mon-sat 12:00-15:00,18:00-23:00")],
    ["smoking-goat", "Smoking Goat", "food", "Shoreditch High Street", "64 Shoreditch High Street", "££", [51.52423, -0.07691],
      "Thai barbecue.", "Fish-sauce chicken wings, and the lardo fried rice.", []],
    ["singburi", "Singburi", "food", "Shoreditch High Street", "Unit 7, Montacute Yards, 185–186 Shoreditch High Street", "££", [51.52432, -0.07836],
      "A cult Thai favourite, known for fiery dishes. No dessert.", "Lamb short rib, nam tok, and a lemongrass paloma.", []],
    ["rochelle-canteen", "Rochelle Canteen", "food", "Arnold Circus", "16 Playground Gardens", "£££", [51.52562, -0.07417],
      "Seasonal British cooking.", "Grilled sardines, then blood orange polenta cake.", ["Lunch"], false, false,
      H("tue 12:00-15:00; wed-sat 12:00-15:00,17:30-19:45; sun 12:00-15:00")],
    ["brat", "Brat", "food", "Redchurch Street", "4 Redchurch Street", "£££", [51.52427, -0.07669],
      "Basque-leaning chophouse cooking over fire. Michelin-starred.", "Beef chops to share, and the Basque cheesecake.", ["Book ahead", "Michelin star"], true],
    ["manteca", "Manteca", "food", "Curtain Road", "49–51 Curtain Road", "££", [51.52398, -0.08061],
      "Nose-to-tail Italian.", "Mafaldine with beef offal ragù.", []],
    ["plates", "Plates", "food", "Old Street", "320 Old Street", "£££", [51.52653, -0.08198],
      "Michelin-starred vegan tasting menus (£90 lunch, £108 dinner). The waiting list runs months; lunch is the cheaper way in.", "The tasting menu.", ["Book ahead", "Michelin star", "Vegan"], true],
    ["cycene", "Cycene", "food", "Chance Street", "9 Chance Street", "££££", [51.52462, -0.07517],
      "Michelin-starred British tasting menu with foraged ingredients, at just six tables. Saturday lunch is £95 against £190 for dinner.", "Charcoal-seared wagyu and the bone marrow tartlet come with the menu.", ["Book ahead", "Michelin star"], true, true,
      H("wed-fri 18:15-23:00; sat 12:30-15:00,18:15-23:00")],
    ["tatar-bunar", "Tatar Bunar", "food", "Curtain Road", "152 Curtain Road", "££", [51.52683, -0.08022],
      "Southern Ukrainian cooking.", "Lamb and beef tartare, cheburek, then crêpes with cottage cheese.", []],
    ["padella", "Padella", "food", "Phipp Street", "1 Phipp Street", "£", [51.52332, -0.082],
      "A fresh pasta bar.", "Cacio e pepe, or the beef shin pappardelle.", [], false, false,
      H("mon-sat 12:00-15:45,17:00-22:00; sun 12:00-21:00")],
    ["macbeth", "The Macbeth", "food", "Hoxton Street", "70 Hoxton Street", "££", [51.53013, -0.08009],
      "A gastropub doing Portuguese-inspired small plates.", "The bifana and the lamb samosa.", []],
    ["clove-club", "The Clove Club", "food", "Old Street", "Shoreditch Town Hall, 380 Old Street", "££££", [51.52708, -0.07916],
      "Two Michelin stars in Shoreditch Town Hall. Full tasting menu £225; a three-course lunch is £95.", "The tasting menu: sardine sashimi, scallops in dashi.", ["Book ahead", "Two Michelin stars"], true, false,
      H("mon-tue 18:30-23:00; wed-sat 12:00-16:30,18:30-23:00")],
    ["senza-fondo", "Senza Fondo", "food", "Hoxton", "1 Rufus Street", "££", [51.52697, -0.08142],
      "Italian-American with bottomless lasagne (£20 a head) and live piano.", "The bottomless lasagne.", []],
    ["bubala", "Bubala", "food", "Spitalfields", "65 Commercial Street", "££", [51.51786, -0.07415],
      "Vegetarian Middle Eastern sharing plates in about 30 seats.", "Honey halloumi and falafel, or 'Bubala Knows Best' at £44 a head.", ["Vegetarian"]],
    ["zapote", "Zapote", "food", "Leonard Street", "70 Leonard Street", "££", [51.52461, -0.08307],
      "Contemporary Mexican.", "Duck quesadilla, scallop ceviche, and a pistachio doughnut.", [], false, false,
      H("tue-sat 12:00-15:00,17:30-22:00")],
    ["cecconis", "Cecconi's", "food", "Redchurch Street", "58–60 Redchurch Street", "££", [51.52439, -0.07441],
      "Northern Italian cicchetti from the Soho House group, open from 7.30am.", "Breakfast focaccia with mortadella, fried egg and burrata.", ["Breakfast"]],
    ["smokestak", "Smokestak", "food", "Sclater Street", "35 Sclater Street", "££", [51.52366, -0.07283],
      "Barbecue.", "Beef brisket, and pigtails with soy molasses.", []],
    ["gloria", "Gloria", "food", "Great Eastern Street", "54–56 Great Eastern Street", "££", [51.52506, -0.08126],
      "An Italian trattoria. Expect to wait.", "Mafaldine al tartufo for two, and crocchè.", ["Expect a wait"]],
    ["dishoom", "Dishoom", "food", "Boundary Street", "7 Boundary Street", "££", [51.5245, -0.07682],
      "Indian cooking in the style of an Irani café.", "Black dal, lamb raan, and the prawn pathia that's only on here.", []],
    ["lahpet", "Lahpet", "food", "Bethnal Green Road", "58 Bethnal Green Road", "££", [51.52411, -0.07298],
      "Burmese cooking.", "Tea-leaf salad, and coconut noodles with chicken.", [], false, false,
      H("mon-fri 17:30-22:00; sat 12:00-22:00; sun 12:00-20:30")],
    // From olive (Aug 2026) and The Infatuation
    ["blacklock", "Blacklock", "food", "Rivington Street", "28–30 Rivington Street", "", [51.52597, -0.08189],
      "A steakhouse in a Victorian warehouse.", "'All In' chops, then the white chocolate cheesecake.", []],
    ["kricket", "Kricket", "food", "Charlotte Road", "35–42 Charlotte Road", "", [51.5251, -0.08097],
      "Modern Indian sharing plates.", "Keralan fried chicken, and recheado butter prawns.", []],
    ["hoppers", "Hoppers", "food", "Shoreditch High Street", "The Tea Building, 56 Shoreditch High Street", "", [51.52378, -0.07639],
      "Sri Lankan and South Indian cooking.", "Prawn paniyaram, a crab kari omelette, and an Arrack Attack.", []],
    ["som-saa", "som saa", "food", "Spitalfields", "43A Commercial Street", "", [51.51737, -0.07378],
      "Regional Thai cooking.", "Gai yaang and mu parlow.", []],
    ["sohaila", "Sohaila", "food", "Shoreditch High Street", "232 Shoreditch High Street", "", [51.52225, -0.07823],
      "A modern Lebanese restaurant and wine bar.", "", []],
    ["llama-inn", "Llama Inn", "food", "Great Eastern Street", "The Hoxton, 81 Great Eastern Street", "", [51.52545, -0.08284],
      "Modern Peruvian on the roof of The Hoxton hotel.", "Pisco sours and scallop ceviche.", ["Rooftop"]],

    // ── Coffee (London x London's Shoreditch café guide, Sep 2026) ───────
    ["grind", "Shoreditch Grind", "coffee", "Old Street", "213 Old Street", "£", [51.52596, -0.08815],
      "Loud all-day café and cocktail bar by Old Street station, pouring its own roast.", "The house blend, or a cocktail later.", []],
    ["friends-of-ours", "Friends of Ours", "coffee", "Hoxton", "61 Pitfield Street", "£", [51.52911, -0.08375],
      "A neighbourhood café with a seasonal menu, using Dark Arts and a guest roaster.", "A golden or lavender latte.", []],
    ["origin", "Origin Coffee", "coffee", "Charlotte Road", "65 Charlotte Road", "£", [51.52635, -0.08115],
      "Café and roaster buying direct-trade coffee. Small, so seats go fast.", "", ["Roaster"]],
    ["kahaila", "Kahaila", "coffee", "Brick Lane", "135 Brick Lane", "£", [51.52382, -0.07162],
      "A good-value community café run as a charity.", "A red-velvet cupcake.", []],
    ["fix-126", "Fix 126", "coffee", "Curtain Road", "126 Curtain Road", "£", [51.52613, -0.08007],
      "Café since 2009, with Climpson & Sons house blends, a decaf and a weekly guest coffee. Shared tables.", "", []],
    ["ozone", "Ozone Coffee Roasters", "coffee", "Leonard Street", "11 Leonard Street", "£", [51.5247, -0.08674],
      "Roasts on site and supplies other cafés; bags to take home.", "", ["Roaster"]],
    ["alchemy", "Alchemy Coffee", "coffee", "Paul Street", "Paul Street", "£", [51.52368, -0.08415],
      "Light roasts served in conical flasks. Closes at 3pm.", "", []],
    ["paper-and-cup", "Paper & Cup", "coffee", "Calvert Avenue", "18 Calvert Avenue", "£", [51.52622, -0.07684],
      "A café that trains people recovering from addiction as baristas, with cheap espresso and secondhand books.", "", []],

    // ── Bars (Time Out Sep 2026, The Infatuation Jul 2025, olive) ────────
    ["waltz", "Waltz", "drinks", "Scrutton Street", "28 Scrutton Street", "", [51.5232, -0.08289],
      "A 12-seat Japanese-inspired cocktail counter whose menu follows 72 'micro-seasons'. Five stars from Time Out.", "The 'Brooklyn, Tokyo', or a sake gibson.", ["Book ahead", "Cocktails"], true],
    ["lowcountry", "Lowcountry", "drinks", "Hoxton", "71 Nile Street", "££", [51.5295, -0.08796],
      "A basement bar under Counter 71 for American whiskey and Southern-style cocktails.", "The London Negroni.", ["Book ahead", "Cocktails"], true],
    ["seed-library", "Seed Library", "drinks", "Shoreditch High Street", "100 Shoreditch High Street", "", [51.52582, -0.07742],
      "Mr Lyan's basement cocktail bar under One Hundred Shoreditch. Loud at weekends.", "Boulevardier with quince.", ["Cocktails"]],
    ["happiness-forgets", "Happiness Forgets", "drinks", "Hoxton Square", "8–9 Hoxton Square", "££", [51.52784, -0.08167],
      "A candlelit basement cocktail bar; sit at the bar if you can.", "", ["Book ahead", "Cocktails"], true],
    ["nightjar", "Nightjar", "drinks", "City Road", "129 City Road", "££", [51.52648, -0.08775],
      "A Prohibition-style speakeasy with experimental cocktails and a swing band after 9pm.", "", ["Book well ahead", "Cocktails"], true],
    ["black-rock", "Black Rock", "drinks", "Christopher Street", "9 Christopher Street", "£££", [51.52142, -0.08459],
      "A whisky specialist bar. Not one for groups.", "", ["Whisky"]],
    ["discount-suit", "Discount Suit Company", "drinks", "Spitalfields", "29a Wentworth Street", "", [51.51678, -0.07545],
      "A hidden basement bar that gets busy.", "", ["Cocktails"]],
    ["umbrella-workshop", "The Umbrella Workshop", "drinks", "Boundary Street", "10 Cleeve Workshops, Boundary Street", "", [51.52609, -0.07716],
      "A cocktail bar with a menu that changes weekly. Walk-ins welcome.", "", ["Cocktails"]],
    ["passione-vino", "Passione Vino", "drinks", "Leonard Street", "85 Leonard Street", "", [51.52477, -0.08239],
      "Italian wine bar with an upstairs room behind a mirrored wall.", "", ["Wine"]],
    ["mad-cats", "Mad Cats", "drinks", "Redchurch Street", "107 Redchurch Street", "", [51.52488, -0.07241],
      "A listening bar with Japanese small plates.", "Shochu spritzes and yellowtail carpaccio.", []],
    ["gibneys", "Gibney's London", "drinks", "City Road", "70 City Road", "", [51.52474, -0.08773],
      "An Irish pub with good food.", "A Guinness and the beef and bone marrow cheeseburger.", ["Pub"]],
    ["chiave", "Chiave", "drinks", "Redchurch Street", "36 Redchurch Street", "", [51.5243, -0.07534],
      "A cocktail bar pairing drinks with songs.", "Street Spirit, or the Tommy margarita.", ["Cocktails"]],
    ["callooh-callay", "Callooh Callay", "drinks", "Rivington Street", "65 Rivington Street", "££", [51.52629, -0.07988],
      "A Shoreditch cocktail bar since 2008.", "", ["Cocktails"]],
    ["mikkeller", "Mikkeller Bar", "drinks", "Hackney Road", "2–4 Hackney Road", "£££", [51.52733, -0.07695],
      "The Danish brewer's London bar.", "Whatever's new on tap.", ["Beer"]],
    ["oranj", "Oranj", "drinks", "Spitalfields", "15 Dray Walk", "£££", [51.52113, -0.07266],
      "A natural wine bar with food pop-ups.", "", ["Wine"]],
  ].map(([id, name, kind, area, addr, price, [lat, lng], blurb, order, tags, book, approx, hours]) => ({
    id: "shoreditch-" + id, city: "shoreditch", name, kind, area, addr, price, lat, lng, blurb, order, tags,
    book: !!book, approx: !!approx, q: `${name}, ${addr}, London`,
    ...(hours ? { hours, hoursNote: TO_HOURS } : {}),
  })));
}
