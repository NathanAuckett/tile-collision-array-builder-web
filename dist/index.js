import Grid from "./Grid.js";
window.addEventListener("load", function () {
    const canvas = document.getElementById("grid");
    canvas.width = 500;
    canvas.height = 500;
    const gridCellCountW = 16;
    const gridCellCountH = 16;
    const gridX = 32;
    const gridY = 32;
    const gridX2 = canvas.width - 32;
    const gridY2 = canvas.height - 32;
    // Draw grid
    const grid = new Grid(canvas, gridX, gridY, gridX2, gridY2, gridCellCountW, gridCellCountH);
    grid.draw();
});
