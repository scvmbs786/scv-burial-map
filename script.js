function getSpaceKey(plot, space) {
  return `${plot}-${space}`;
}

function getSpaceInfo(spaceStatus, plot, space) {
  const key = getSpaceKey(plot, space);
  const info = spaceStatus[key] || {};
  return {
    status: info.status || DEFAULT_STATUS,
    name: info.name || null,
    note: info.note || null
  };
}

function statusToClass(status) {
  switch (status) {
    case "reserved": return "reserved";
    case "occupied": return "occupied";
    case "sold": return "occupied";
    case "not-available": return "not-available";
    default: return "available";
  }
}

function isInteractiveMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get("interactive") === "true";
}

function renderMap(spaceStatus) {
  const svg = document.getElementById("burial-map");
  const details = document.getElementById("details-content");

  const marginTop = 50;   // keep top spacing
  const marginLeft = 20;  // reduce left spacing
  let currentY = marginTop;
  let currentX = marginLeft;

  while (svg.firstChild) svg.removeChild(svg.firstChild);

  plotRows.forEach((row) => {
    let currentX = margin;
    let rowHeight = 0;

    row.plots.forEach((plotDef) => {
      const { plot, spacesTop, spacesBottom } = plotDef;

      const cols = Math.max(spacesTop, spacesBottom);
      const plotWidth = cols * (SPACE_SIZE + SPACE_GAP) - SPACE_GAP;

      const plotStartX = currentX;
      const plotStartY = currentY;

      let maxSpaceX = plotStartX;
      let maxSpaceY = plotStartY;

      // -----------------------------
      // TOP SPACES
      // -----------------------------
      if (spacesTop > 0) {
        for (let i = 0; i < spacesTop; i++) {
          const spaceNumber = i + 1;
          const x = currentX + i * (SPACE_SIZE + SPACE_GAP);
          const y = currentY;

          const { status } = getSpaceInfo(spaceStatus, plot, spaceNumber);

          const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", x);
          rect.setAttribute("y", y);
          rect.setAttribute("width", SPACE_SIZE);
          rect.setAttribute("height", SPACE_SIZE);
          rect.setAttribute("class", `space ${statusToClass(status)}`);
          rect.dataset.plot = plot;
          rect.dataset.space = spaceNumber;

          // CLICK LOGIC UPDATED HERE
          rect.addEventListener("click", () => {
            const info = getSpaceInfo(spaceStatus, plot, spaceNumber);

            if (info.status === "occupied") {
              selectSpace(rect, plot, spaceNumber);
              return;
            }

            if (info.status === "reserved" && isInteractiveMode()) {
              selectSpace(rect, plot, spaceNumber);
              return;
            }

            if (info.status === "available") {
              selectSpace(rect, plot, spaceNumber);
              return;
            }

            // not-available → do nothing
          });

          svg.appendChild(rect);

          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", x + SPACE_SIZE / 2);
          label.setAttribute("y", y + SPACE_SIZE / 2);
          label.setAttribute("class", "space-label");
          label.textContent = (status === "not-available") ? "X" : spaceNumber;
          svg.appendChild(label);

          maxSpaceX = Math.max(maxSpaceX, x + SPACE_SIZE);
          maxSpaceY = Math.max(maxSpaceY, y + SPACE_SIZE);
        }
      }

      // -----------------------------
      // BOTTOM SPACES
      // -----------------------------
      const hasTop = spacesTop > 0;
      const bottomStart = hasTop ? 5 : 1;
      const bottomY = currentY + (hasTop ? SPACE_SIZE + SPACE_GAP : 0);

      for (let i = 0; i < spacesBottom; i++) {
        const spaceNumber = bottomStart + i;
        const x = currentX + i * (SPACE_SIZE + SPACE_GAP);
        const y = bottomY;

        const { status } = getSpaceInfo(spaceStatus, plot, spaceNumber);

        const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", SPACE_SIZE);
        rect.setAttribute("height", SPACE_SIZE);
        rect.setAttribute("class", `space ${statusToClass(status)}`);
        rect.dataset.plot = plot;
        rect.dataset.space = spaceNumber;

        // CLICK LOGIC UPDATED HERE
        rect.addEventListener("click", () => {
          const info = getSpaceInfo(spaceStatus, plot, spaceNumber);

          if (info.status === "occupied") {
            selectSpace(rect, plot, spaceNumber);
            return;
          }

          if (info.status === "reserved" && isInteractiveMode()) {
            selectSpace(rect, plot, spaceNumber);
            return;
          }

          if (info.status === "available") {
            selectSpace(rect, plot, spaceNumber);
            return;
          }

          // not-available → do nothing
        });

        svg.appendChild(rect);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x + SPACE_SIZE / 2);
        label.setAttribute("y", y + SPACE_SIZE / 2);
        label.setAttribute("class", "space-label");
        label.textContent = (status === "not-available") ? "X" : spaceNumber;
        svg.appendChild(label);

        maxSpaceX = Math.max(maxSpaceX, x + SPACE_SIZE);
        maxSpaceY = Math.max(maxSpaceY, y + SPACE_SIZE);
      }

      // PLOT BORDER
      const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      border.setAttribute("x", plotStartX - 4);
      border.setAttribute("y", plotStartY - 24);
      border.setAttribute("width", maxSpaceX - plotStartX + 8);
      border.setAttribute("height", maxSpaceY - plotStartY + 28);
      border.setAttribute("class", "plot-border");
      svg.appendChild(border);

      // PLOT LABEL
      const labelX = plotStartX + (maxSpaceX - plotStartX) / 2;
      const labelY = plotStartY - 8;

      const plotLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      plotLabel.setAttribute("x", labelX);
      plotLabel.setAttribute("y", labelY);
      plotLabel.setAttribute("class", "plot-label");
      plotLabel.textContent = `Plot ${plot}`;
      svg.appendChild(plotLabel);

      const plotHeight =
        (spacesTop > 0 ? SPACE_SIZE : 0) +
        (spacesBottom > 0 ? SPACE_SIZE : 0) +
        (spacesTop > 0 && spacesBottom > 0 ? SPACE_GAP : 0);

      rowHeight = Math.max(rowHeight, plotHeight + 30);
      currentX += plotWidth + SPACE_GAP;
      maxWidth = Math.max(maxWidth, currentX);
    });

    currentY += rowHeight + SPACE_GAP * 2;
  });

  svg.setAttribute("width", maxWidth + margin);
  svg.setAttribute("height", currentY + margin);

  let selectedRect = null;

  function selectSpace(rect, plot, space) {
    if (selectedRect) selectedRect.classList.remove("selected");
    selectedRect = rect;
    rect.classList.add("selected");

    const info = getSpaceInfo(spaceStatus, plot, space);

    details.innerHTML = `
      <p><strong>Plot:</strong> ${plot}</p>
      <p><strong>Space:</strong> ${space}</p>
      <p><strong>Status:</strong> ${info.status}</p>
      ${info.name ? `<p><strong>Name:</strong> ${info.name}</p>` : ""}
      ${info.note ? `<p><strong>Note:</strong> ${info.note}</p>` : ""}
    `;
  }
}

// ------------------------------------------------------------
// 🔍 SEARCH FUNCTION
// ------------------------------------------------------------
function searchSpacesByName(spaceStatus) {
  const input = document.getElementById("searchInput");
  const query = input.value.trim().toLowerCase();

  const allSpaces = document.querySelectorAll("rect.space");

  if (query === "") {
    allSpaces.forEach(rect => rect.classList.remove("highlight"));
    return;
  }

  allSpaces.forEach(rect => {
    const plot = rect.dataset.plot;
    const space = rect.dataset.space;
    const key = `${plot}-${space}`;

    const info = spaceStatus[key];
    const name = info?.name?.toLowerCase() || "";

    if (name.includes(query)) {
      rect.classList.add("highlight");
    } else {
      rect.classList.remove("highlight");
    }
  });
}

// ------------------------------------------------------------
// 🔥 Load Google Sheet → Then Render Map
// ------------------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadSpaceStatus().then(spaceStatus => {
    renderMap(spaceStatus);

    const input = document.getElementById("searchInput");
    input.addEventListener("input", () => searchSpacesByName(spaceStatus));
  });
});