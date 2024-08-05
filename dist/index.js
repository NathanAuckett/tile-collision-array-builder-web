import Grid from "./Grid.js";
import drawArraysOnGrid from "./drawArraysOnGrid.js";
function main() {
    const canvas = document.getElementById("grid");
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 600;
    // Draw grid
    const grid = new Grid(canvas, 32, 32, canvas.width - 32, canvas.height - 32, 16, 16);
    grid.draw();
    let mouseGridIndexX = 0;
    let mouseGridIndexY = 0;
    const heightArray = new Array(grid.cellCountX).fill(0);
    const widthArray = new Array(grid.cellCountY).fill(0);
    drawArraysOnGrid(canvas, grid, heightArray, widthArray);
}
window.addEventListener("load", function () {
    main();
});
