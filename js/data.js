// rel windows are in days relative to the anchor frost date (negative = before, positive = after).
// maturity = days to harvest, used so tender crops aren't suggested too close to fall frost.
// perSqFt = plants per square foot (square-foot-gardening standard); < 1 means "1 plant per (1/perSqFt) sq ft".
// plotTip = a short caution for shared small (10x10) plots.
export const PLANTS = [
  { name: "Lettuce", cat: "Vegetable", perSqFt: 4, acts: [
    { label: "Direct sow", anchor: "spring", min: -21, max: 28 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -56, max: -21 } ]},
  { name: "Spinach", cat: "Vegetable", perSqFt: 9, acts: [
    { label: "Direct sow", anchor: "spring", min: -28, max: 14 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -42, max: -14 } ]},
  { name: "Peas", cat: "Vegetable", perSqFt: 8, plotTip: "trellis it — saves ground space", acts: [
    { label: "Direct sow", anchor: "spring", min: -28, max: 7 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -70, max: -49 } ]},
  { name: "Radish", cat: "Vegetable", perSqFt: 16, acts: [
    { label: "Direct sow", anchor: "spring", min: -21, max: 35 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -42, max: -14 } ]},
  { name: "Carrots", cat: "Vegetable", perSqFt: 16, acts: [
    { label: "Direct sow", anchor: "spring", min: -14, max: 42 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -77, max: -42 } ]},
  { name: "Beets", cat: "Vegetable", perSqFt: 9, acts: [
    { label: "Direct sow", anchor: "spring", min: -14, max: 42 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -63, max: -35 } ]},
  { name: "Kale", cat: "Vegetable", perSqFt: 1, acts: [
    { label: "Direct sow", anchor: "spring", min: -21, max: 35 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -63, max: -28 } ]},
  { name: "Swiss Chard", cat: "Vegetable", perSqFt: 1, acts: [
    { label: "Direct sow", anchor: "spring", min: -14, max: 42 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -56, max: -21 } ]},
  { name: "Arugula", cat: "Vegetable", perSqFt: 4, acts: [
    { label: "Direct sow", anchor: "spring", min: -21, max: 42 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -49, max: -14 } ]},
  { name: "Broccoli", cat: "Vegetable", perSqFt: 1, acts: [
    { label: "Start indoors", anchor: "spring", min: -70, max: -49 },
    { label: "Transplant seedlings", anchor: "spring", min: -14, max: 14 },
    { label: "Transplant (fall crop)", anchor: "fall", min: -70, max: -49 } ]},
  { name: "Cabbage", cat: "Vegetable", perSqFt: 1, acts: [
    { label: "Start indoors", anchor: "spring", min: -70, max: -49 },
    { label: "Transplant seedlings", anchor: "spring", min: -14, max: 14 },
    { label: "Transplant (fall crop)", anchor: "fall", min: -77, max: -56 } ]},
  { name: "Onions", cat: "Vegetable", perSqFt: 16, acts: [
    { label: "Plant sets/transplants", anchor: "spring", min: -28, max: 21 } ]},
  { name: "Garlic", cat: "Vegetable", perSqFt: 4, plotTip: "in the ground ~8 months — give it a dedicated corner", acts: [
    { label: "Plant cloves (fall only)", anchor: "fall", min: -42, max: -14 } ]},
  { name: "Parsley", cat: "Herb", perSqFt: 1, acts: [
    { label: "Start indoors", anchor: "spring", min: -70, max: -42 },
    { label: "Direct sow / transplant", anchor: "spring", min: -14, max: 28 } ]},
  { name: "Cilantro", cat: "Herb", perSqFt: 4, acts: [
    { label: "Direct sow", anchor: "spring", min: -21, max: 21 },
    { label: "Direct sow (fall crop)", anchor: "fall", min: -49, max: -21 } ]},
  { name: "Chives", cat: "Herb", perSqFt: 4, plotTip: "perennial — takes permanent space", acts: [
    { label: "Direct sow / transplant", anchor: "spring", min: -14, max: 42 } ]},

  // Warm-season, frost-tender (need enough days left before fall frost to mature)
  { name: "Tomatoes", cat: "Vegetable", tender: true, maturity: 70, perSqFt: 1, plotTip: "cage or stake — keep to 1–2 plants in a shared plot", acts: [
    { label: "Start indoors", anchor: "spring", min: -56, max: -42 },
    { label: "Transplant outdoors", anchor: "spring", min: 0, max: 21, checkFall: true } ]},
  { name: "Peppers", cat: "Vegetable", tender: true, maturity: 75, perSqFt: 1, acts: [
    { label: "Start indoors", anchor: "spring", min: -77, max: -56 },
    { label: "Transplant outdoors", anchor: "spring", min: 7, max: 28, checkFall: true } ]},
  { name: "Basil", cat: "Herb", tender: true, maturity: 60, perSqFt: 4, acts: [
    { label: "Start indoors", anchor: "spring", min: -42, max: -21 },
    { label: "Direct sow / transplant", anchor: "spring", min: 7, max: 35, checkFall: true } ]},
  { name: "Bush Beans", cat: "Vegetable", tender: true, maturity: 55, perSqFt: 9, acts: [
    { label: "Direct sow", anchor: "spring", min: 0, max: 42, checkFall: true } ]},
  { name: "Corn", cat: "Vegetable", tender: true, maturity: 75, perSqFt: 1, plotTip: "needs a 4×4 ft block to pollinate — usually skip in a single 10×10 shared plot", acts: [
    { label: "Direct sow", anchor: "spring", min: 0, max: 35, checkFall: true } ]},
  { name: "Squash / Zucchini", cat: "Vegetable", tender: true, maturity: 50, perSqFt: 0.25, plotTip: "vigorous — give it its own corner or grow vertically", acts: [
    { label: "Direct sow", anchor: "spring", min: 0, max: 42, checkFall: true } ]},
  { name: "Cucumbers", cat: "Vegetable", tender: true, maturity: 55, perSqFt: 2, plotTip: "trellis it to save ground space", acts: [
    { label: "Direct sow", anchor: "spring", min: 0, max: 42, checkFall: true } ]},
  { name: "Pumpkins", cat: "Vegetable", tender: true, maturity: 100, perSqFt: 0.0625, plotTip: "vines sprawl 10+ ft — not recommended for a shared 10×10; try a mini variety", acts: [
    { label: "Direct sow", anchor: "spring", min: 0, max: 21, checkFall: true } ]},
  { name: "Melons", cat: "Vegetable", tender: true, maturity: 80, perSqFt: 0.11, plotTip: "sprawling — trellis vertically to save space", acts: [
    { label: "Direct sow", anchor: "spring", min: 7, max: 28, checkFall: true } ]},
  { name: "Sunflowers", cat: "Flower", tender: true, maturity: 70, perSqFt: 0.25, plotTip: "tall — plant on the north side so it doesn't shade the rest of the plot", acts: [
    { label: "Direct sow", anchor: "spring", min: 0, max: 56, checkFall: true } ]},
  { name: "Marigolds", cat: "Flower", tender: true, maturity: 50, perSqFt: 4, acts: [
    { label: "Start indoors", anchor: "spring", min: -56, max: -35 },
    { label: "Direct sow / transplant", anchor: "spring", min: 0, max: 56, checkFall: true } ]},
  { name: "Zinnias", cat: "Flower", tender: true, maturity: 60, perSqFt: 4, acts: [
    { label: "Direct sow", anchor: "spring", min: 0, max: 70, checkFall: true } ]},

  // Perennial herbs / fruit (flexible, but take permanent space in a shared plot)
  { name: "Rosemary", cat: "Herb", perSqFt: 0.25, plotTip: "perennial & woody — permanent space, good in a corner", acts: [
    { label: "Transplant", anchor: "spring", min: 0, max: 84 } ]},
  { name: "Thyme", cat: "Herb", perSqFt: 4, plotTip: "perennial — takes permanent space", acts: [
    { label: "Transplant", anchor: "spring", min: -7, max: 84 } ]},
  { name: "Oregano", cat: "Herb", perSqFt: 4, plotTip: "perennial & spreading — takes permanent space", acts: [
    { label: "Transplant", anchor: "spring", min: -7, max: 84 } ]},
  { name: "Strawberries", cat: "Fruit", perSqFt: 4, plotTip: "perennial — keeps the same spot year after year", acts: [
    { label: "Plant (spring)", anchor: "spring", min: -14, max: 28 },
    { label: "Plant (fall)", anchor: "fall", min: -56, max: -21 } ]},

  // Year-round / no-frost warm-season staples
  { name: "Okra", cat: "Vegetable", tender: true, maturity: 60, perSqFt: 1, warmSeasonOnly: true, acts: [
    { label: "Direct sow", anchor: "spring", min: 0, max: 56, checkFall: true } ]},
  { name: "Sweet Potatoes", cat: "Vegetable", tender: true, maturity: 100, perSqFt: 0.25, warmSeasonOnly: true, plotTip: "vines sprawl widely — not ideal for a small shared plot", acts: [
    { label: "Plant slips", anchor: "spring", min: 14, max: 42, checkFall: true } ]},
];

export const MATURITY_BUFFER = 10; // extra safety days before first fall frost

export const PRESETS = [
  { name: "Cold (short season)", spring: "04-25", fall: "09-25" },
  { name: "Temperate (e.g. Zone 6)", spring: "04-15", fall: "10-15" },
  { name: "Mild (e.g. Zone 8)", spring: "03-15", fall: "11-15" },
  { name: "Southern Hemisphere temperate", spring: "10-10", fall: "04-20" },
];

export const DEFAULT_LOCATION = { label: "Valencia, CA 91354", lat: 34.4285, lon: -118.5813, tz: "America/Los_Angeles" };
