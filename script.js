// Helper: get color for a plot based on its status + notes
function getPlotColor(plotData) {
  if (!plotData) return "#e0e0e0";

  // If there are notes and not sold, you might treat as "special"
  if (plotData.notes && plotData.status !== "sold") {
    return STATUS_COLORS.special;
  }

  return STATUS_COLORS[plotData.status] || "#e0e0e0";
}

// Helper: get CSS class for status pill
function getStatusClass(status, hasNotes) {
  if (hasNotes && status !== "sold") return "status-special";
  return `status-${status}`;
}

function renderDetails(plotId, plotData) {
  const panel = document.getElementById("details-content");

  if (!plotData) {
    panel.innerHTML = `
      <p><strong>Plot:</strong> ${plotId}</p>
      <p>No data found for this plot.</p>
    `;
    return;
  }

  const hasNotes = !!plotData.notes;
  const statusClass = getStatusClass(plotData.status, hasNotes);
  const statusLabel = hasNotes && plotData.status !== "sold"
    ? "Special / Notes"
    : plotData.status.charAt(0).toUpperCase() + plotData.status.slice(1);

  panel.innerHTML = `
    <p><strong>Plot:</strong> ${plotId}</p>
    <p><strong>Status:</strong>
      <span class="status-pill ${statusClass}">${statusLabel}</span>
    </p>
    <p><strong>Notes:</strong> ${plotData.notes || "None"}</p>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const svg = document.getElementById("burial-map");
  const plotElements = svg.querySelectorAll(".plot");

  plotElements.forEach((el) => {
    const plotId = el.getAttribute("data-plot-id");
    const plotData = PLOTS[plotId];

    // Set initial color
    el.setAttribute("fill", getPlotColor(plotData));

    // Click handler
    el.addEventListener("click", () => {
      renderDetails(plotId, plotData);
    });
  });
});