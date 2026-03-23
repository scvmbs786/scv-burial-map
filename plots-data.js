// Base size (you can change later)
const SPACE_SIZE = 40;
const SPACE_GAP = 4;

// Map definition: each entry is a "plot row"
const plotRows = [
  // Row 1: only plot 100, 3 spaces (bottom only)
  {
    rowIndex: 1,
    plots: [
      { plot: 100, spacesTop: 0, spacesBottom: 3 }
    ]
  },

  // Row 2: only plot 200, 4 top + 5 bottom
  {
    rowIndex: 2,
    plots: [
      { plot: 200, spacesTop: 4, spacesBottom: 5 }
    ]
  },

  // Row 3: 300–303 with irregular shapes
  {
    rowIndex: 3,
    plots: [
      { plot: 300, spacesTop: 4, spacesBottom: 4 }, // full
      { plot: 301, spacesTop: 2, spacesBottom: 4 }, // 6 spaces
      { plot: 302, spacesTop: 0, spacesBottom: 4 }, // bottom only
      { plot: 303, spacesTop: 0, spacesBottom: 2 }  // bottom only
    ]
  },

  // Row 4: 400–403 (3 full, 1 half)
  {
    rowIndex: 4,
    plots: [
      { plot: 400, spacesTop: 4, spacesBottom: 4 },
      { plot: 401, spacesTop: 4, spacesBottom: 4 },
      { plot: 402, spacesTop: 4, spacesBottom: 4 },
      { plot: 403, spacesTop: 2, spacesBottom: 2 } // half
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
      { plot: 901, spacesTop: 2, spacesBottom: 2 }, // your example
      { plot: 902, spacesTop: 4, spacesBottom: 4 },
      { plot: 903, spacesTop: 2, spacesBottom: 2 }
    ]
  }
];

// Status data per space (you can edit this as needed)
const spaceStatus = {
  // Example entries:
  // "100-1": { status: "occupied", name: "John Doe", note: "Buried 2020" },
  // "400-3": { status: "reserved", name: "Family X", note: "Reserved" },
};

// Default status if not specified
const DEFAULT_STATUS = "available";