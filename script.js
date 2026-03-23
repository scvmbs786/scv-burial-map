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

    // Shared top and bottom Y for the entire row
    const rowTopY = currentY;
    const rowBottomY = rowTopY + SPACE_SIZE + SPACE_GAP;

    let rowHeight = SPACE_SIZE * 2 + SPACE_GAP; // full row height

    row.plots.forEach((plotDef) => {
      const { plot, spacesTop, spacesBottom } = plotDef;

      const cols = Math.max(spacesTop, spacesBottom);
      const plotWidth = cols * (SPACE_SIZE + SPACE_GAP) - SPACE_GAP;

      const plotStartX = currentX;
      const plotStartY = rowTopY;

      let maxSpaceX = plotStartX;
      let maxSpaceY = plotStartY;

      // TOP SPACES
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

      // BOTTOM SPACES (aligned for entire row)
      const bottomStart = spacesTop > 0