// Base size (you can change later)
const SPACE_SIZE = 40;
const SPACE_GAP = 4;

// Map definition: each entry is a "plot row"
const plotRows = [
  // Row 1: Plot 100 (1 top, 3 bottom)
  {
    rowIndex: 1,
    plots: [
      { plot: 100, spacesTop: 1, spacesBottom: 3 }
    ]
  },

  // Row 2: Plot 200 + Plot 201
  {
    rowIndex: 2,
    plots: [
      { plot: 200, spacesTop: 4, spacesBottom: 4 },
      { plot: 201, spacesTop: 4, spacesBottom: 1 }
    ]
  },

  // Row 3: 300–303 with irregular shapes
  {
    rowIndex: 3,
    plots: [
      { plot: 300, spacesTop: 4, spacesBottom: 4 },
      { plot: 301, spacesTop: 2, spacesBottom: 4 },
      { plot: 302, spacesTop: 4, spacesBottom: 4 },
      { plot: 303, spacesTop: 2, spacesBottom: 2 }
    ]
  },

  // Row 4: 400–403
  {
    rowIndex: 4,
    plots: [
      { plot: 400, spacesTop: 4, spacesBottom: 4 },
      { plot: 401, spacesTop: 4, spacesBottom: 4 },
      { plot: 402, spacesTop: 4, spacesBottom: 4 },
      { plot: 403, spacesTop: 2, spacesBottom: 2 }
    ]
  },

  // Row 5: 500–503
  {
    rowIndex: 5,
    plots: [
      { plot: 500, spacesTop: 4, spacesBottom: 4 },
      { plot: 501, spacesTop: 4, spacesBottom: 4 },
      { plot: 502, spacesTop: 4, spacesBottom: 4 },
      { plot: 503, spacesTop: 2, spacesBottom: 2 }
    ]
  },

  // Row 6: 600–603
  {
    rowIndex: 6,
    plots: [
      { plot: 600, spacesTop: 4, spacesBottom: 4 },
      { plot: 601, spacesTop: 4, spacesBottom: 4 },
      { plot: 602, spacesTop: 4, spacesBottom: 4 },
      { plot: 603, spacesTop: 2, spacesBottom: 2 }
    ]
  },

  // Row 7: 700–703
  {
    rowIndex: 7,
    plots: [
      { plot: 700, spacesTop: 4, spacesBottom: 4 },
      { plot: 701, spacesTop: 4, spacesBottom: 4 },
      { plot: 702, spacesTop: 4, spacesBottom: 4 },
      { plot: 703, spacesTop: 2, spacesBottom: 2 }
    ]
  },

  // Row 8: 800–803
  {
    rowIndex: 8,
    plots: [
      { plot: 800, spacesTop: 4, spacesBottom: 4 },
      { plot: 801, spacesTop: 4, spacesBottom: 4 },
      { plot: 802, spacesTop: 4, spacesBottom: 4 },
      { plot: 803, spacesTop: 2, spacesBottom: 2 }
    ]
  },

  // Row 9: 900–903
  {
    rowIndex: 9,
    plots: [
      { plot: 900, spacesTop: 4, spacesBottom: 4 },
      { plot: 901, spacesTop: 4, spacesBottom: 4 },
      { plot: 902, spacesTop: 4, spacesBottom: 4 },
      { plot: 903, spacesTop: 2, spacesBottom: 2 }
    ]
  }
];

// Default status if not specified
const DEFAULT_STATUS = "available";


// ------------------------------------------------------------
// 🔥 DYNAMIC GOOGLE SHEETS LOADER
// ------------------------------------------------------------
async function loadSpaceStatus() {
  const url = "https://script.google.com/macros/s/AKfycbxEfG4o0D6E-hX5bapWGiWGTmulGCIi2WL1y6QkSmI_qp_xPlcZY3jWEp4mVDRq5ZQWbw/exec";

  const response = await fetch(url);
  const rows = await response.json();

  const spaceStatus = {};

  rows.forEach(row => {
    const plot = row["Plot Number"];
    const spaceRaw = row["Space Number"];
    const statusRaw = row["Status"];
    const name = row["Name"] || "";
    const note = row["Notes"] || "";

    if (!plot || !spaceRaw) return;

    const spaces = spaceRaw.toString().split(",").map(s => s.trim());

    let status = DEFAULT_STATUS;
    if (statusRaw) {
      const s = statusRaw.toLowerCase();
      if (s.includes("occupied")) status = "occupied";
      else if (s.includes("not")) status = "not-available";
      else if (s.includes("sold")) status = "reserved";
      else if (s.includes("future")) status = "future";
      else status = "reserved";
    }

    spaces.forEach(space => {
      const key = `${plot}-${space}`;
      spaceStatus[key] = { status };
      if (name) spaceStatus[key].name = name;
      if (note) spaceStatus[key].note = note;
    });
  });

  return spaceStatus;
}