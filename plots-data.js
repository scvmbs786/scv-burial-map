// plots-data.js
const PLOTS = {
  "A-01": {
    status: "available",
    notes: "",
  },
  "A-02": {
    status: "reserved",
    notes: "Pending payment",
  },
  "A-03": {
    status: "sold",
    notes: "Family plot",
  },
  // ...continue for all plots
};

// Simple mapping from status → color
const STATUS_COLORS = {
  available: "#4CAF50", // green
  reserved: "#2196F3",  // blue
  sold: "#F44336",      // red
  special: "#FFC107",   // amber/yellow
};