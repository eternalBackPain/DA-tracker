//ADD TOOLTIP
export function createTooltip(content) {
  const tooltip = document.querySelector(".tooltip");
  tooltip.textContent = content;
  document.body.appendChild(tooltip);
  return tooltip;
}

export function removeTooltip(tooltip) {
  document.body.removeChild(tooltip);
}

export function showTooltip(event, content) {
  const tooltip = createTooltip(content);

  // Position the tooltip near the mouse cursor
  tooltip.style.left = event.pageX + "px";
  tooltip.style.top = event.pageY + "px";

  // Event listener to remove the tooltip when the mouse moves
  document.addEventListener("mousemove", removeTooltipOnMouseMove);

  function removeTooltipOnMouseMove() {
    removeTooltip(tooltip);
    document.removeEventListener("mousemove", removeTooltipOnMouseMove);
  }
}

//NOT SURE IF THIS STUFF WILL WORK
export function handleMouseHover(event) {
    const object = event.target; // The hovered object in the visualization
    if (object) {
      const centroid = object.centroid.join(', ');
      const count = object.points.length;
      const tooltipContent = `${centroid}\nCount: ${count}`;
      showTooltip(event, tooltipContent);
    }
  }
  

