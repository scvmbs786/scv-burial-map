function getSpaceKey(plot, space) {
  return `${plot}-${space}`;
}

function getSpaceInfo(plot, space) {
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
    default: return "available";
  }
}

function renderMap() {
  const svg = document.getElementById("burial-map");
  const details = document.getElementById("details-content");

  const margin = 20;
  let currentY = margin;
  let maxWidth = 0;

  while (svg.firstChild) svg.removeChild(svg.firstChild);

  plotRows.forEach((row) => {
    let currentX = margin;

    // Determine row height based on whether any plot has top spaces
    const rowHasTop = row.plots.some(p => p.spacesTop > 0);
    const rowHasBottom = row.plots.some(p => p.spacesBottom > 0);

    const rowTopY = currentY;
    const rowBottomY = rowTopY + (rowHasTop ? SPACE_SIZE + SPACE_GAP : 0);

    let rowHeight =
      (rowHasTop ? SPACE_SIZE : 0) +
      (rowHasBottom ? SPACE_SIZE : 0) +
      (rowHasTop && rowHasBottom ? SPACE_GAP : 0);

    row.plots.forEach((plotDef) => {
      const { plot, spacesTop, spacesBottom } = plotDef;

      const cols = Math.max(spacesTop, spacesBottom);
      const plotWidth = cols * (SPACE_SIZE + SPACE_GAP) - SPACE_GAP;

      const plotStartX = currentX;

      let maxSpaceX = plotStartX;
      let maxSpaceY = rowTopY;

      // TOP SPACES (only if spacesTop > 0)
      if (spacesTop > 0) {
        for (let i = 0; i < spacesTop; i++) {
          const spaceNumber = i + 1;
          const x = currentX + i * (SPACE_SIZE + SPACE_GAP);
          const y = rowTopY;

          const { status } = getSpaceInfo(plot, spaceNumber);

          const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", x);
          rect.setAttribute("y", y);
          rect.setAttribute("width", SPACE_SIZE);
          rect.setAttribute("height", SPACE_SIZE);
          rect.setAttribute("class", `space ${statusToClass(status)}`);
          rect.dataset.plot = plot;
          rect.dataset.space = spaceNumber;

          rect.addEventListener("click", () => selectSpace(rect, plot, spaceNumber));
          svg.appendChild(rect);

          // Space label
          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", x + SPACE_SIZE / 2);
          label.setAttribute("y", y + SPACE_SIZE / 2);
          label.setAttribute("class", "space-label");
          label.textContent = spaceNumber;
          svg.appendChild(label);

          maxSpaceX = Math.max(maxSpaceX, x + SPACE_SIZE);
          maxSpaceY = Math.max(maxSpaceY, y + SPACE_SIZE);
        }
      }

      // BOTTOM SPACES (always if spacesBottom > 0)
      if (spacesBottom > 0) {
        const bottomStart = spacesTop > 0 ? 5 : 1;

        for (let i = 0; i < spacesBottom; i++) {
          const spaceNumber = bottomStart + i;
          const x = currentX + i * (SPACE_SIZE + SPACE_GAP);
          const y = rowBottomY;

          const { status } = getSpaceInfo(plot, spaceNumber);

          const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
          rect.setAttribute("x", x);
          rect.setAttribute("y", y);
          rect.setAttribute("width", SPACE_SIZE);
          rect.setAttribute("height", SPACE_SIZE);
          rect.setAttribute("class", `space ${statusToClass(status)}`);
          rect.dataset.plot = plot;
          rect.dataset.space = spaceNumber;

          rect.addEventListener("click", () => selectSpace(rect, plot, spaceNumber));
          svg.appendChild(rect);

          // Space label
          const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
          label.setAttribute("x", x + SPACE_SIZE / 2);
          label.setAttribute("y", y + SPACE_SIZE / 2);
          label.setAttribute("class", "space-label");
          label.textContent = spaceNumber;
          svg.appendChild(label);

          maxSpaceX = Math.max(maxSpaceX, x + SPACE_SIZE);
          maxSpaceY = Math.max(maxSpaceY, y + SPACE_SIZE);
        }
      }

      // PLOT BORDER
      const border = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      border.setAttribute("x", plotStartX - 4);
      border.setAttribute("y", rowTopY - 24);
      border.setAttribute("width", maxSpaceX - plotStartX + 8);
      border.setAttribute("height", rowHeight + 28);
      border.setAttribute("class", "plot-border");
      svg.appendChild(border);

      // PLOT LABEL (Option A)
      const labelX = plotStartX + (maxSpaceX - plotStartX) / 2;
      const labelY = rowTopY - 8;

      const plotLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
      plotLabel.setAttribute("x", labelX);
      plotLabel.setAttribute("y", labelY);
      plotLabel.setAttribute("class", "plot-label");
      plotLabel.textContent = `Plot ${plot}`;
      svg.appendChild(plotLabel);

      currentX += plotWidth + SPACE_GAP;
      maxWidth = Math.max(maxWidth, currentX);
    });

    currentY += rowHeight + SPACE_GAP * 3;
  });

  svg.setAttribute("width", maxWidth + margin);
  svg.setAttribute("height", currentY + margin);

  let selectedRect = null;

  function selectSpace(rect, plot, space) {
    if (selectedRect) selectedRect.classList.remove("selected");
    selectedRect = rect;
    rect.classList.add("selected");

    const info = getSpaceInfo(plot, space);

    details.innerHTML = `
      <p><strong>Plot:</strong> ${plot}</p>
      <p><strong>Space:</strong> ${space}</p>
      <p><strong>Status:</strong> ${info.status}</p>
      ${info.name ? `<p><strong>Name:</strong> ${info.name}</p>` : ""}
      ${info.note ? `<p><strong>Note:</strong> ${info.note}</p>` : ""}
    `;
  }
}

document.addEventListener("DOMContentLoaded", renderMap);