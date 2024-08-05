import Grid from "./Grid.js";
function main() {
    const canvas = document.getElementById("grid");
    const ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 500;
    const gridCellCountX = 16;
    const gridCellCountY = 16;
    const gridX1 = 32;
    const gridY1 = 32;
    const gridX2 = canvas.width - 32;
    const gridY2 = canvas.height - 32;
    const gridWidth = gridX2 - gridX1;
    const gridHeight = gridY2 - gridY1;
    const gridCellWidth = gridWidth / gridCellCountX;
    const gridCellHeight = gridHeight / gridCellCountY;
    let mouseGridIndexX = 0;
    let mouseGridIndexY = 0;
    const heightArray = new Array(gridCellCountX).fill(0);
    const widthArray = new Array(gridCellCountY).fill(0);
    // Draw grid
    const grid = new Grid(canvas, gridX1, gridY1, gridX2, gridY2, gridCellCountX, gridCellCountY);
    grid.draw();
    window.addEventListener("mousedown", (e) => {
        if (e.button == 0) {
            const rect = canvas.getBoundingClientRect();
            mouseGridIndexX = grid.cellXIndexFromCanvasX(e.clientX - rect.x);
            mouseGridIndexY = grid.cellYIndexFromCanvasY(e.clientY - rect.y);
            console.log(mouseGridIndexX, mouseGridIndexY);
            //Height array
            for (var i = 0; i < gridCellCountX; i++) {
                if (i < mouseGridIndexX) {
                    if (heightArray[i] > gridCellCountX - mouseGridIndexY) {
                        heightArray[i] = gridCellCountX - mouseGridIndexY;
                    }
                }
                else {
                    if (heightArray[i] < gridCellCountX - mouseGridIndexY) {
                        heightArray[i] = gridCellCountX - mouseGridIndexY;
                    }
                }
            }
            //widthArray
            for (var i = 0; i < gridCellCountY; i++) {
                if (i < mouseGridIndexY) {
                    if (widthArray[i] > gridCellCountY - mouseGridIndexX) {
                        widthArray[i] = gridCellCountY - mouseGridIndexX;
                    }
                }
                else {
                    if (widthArray[i] < gridCellCountY - mouseGridIndexX) {
                        widthArray[i] = gridCellCountY - mouseGridIndexX;
                    }
                }
            }
            //Draw updated frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            //Draw arrays
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            //Height array
            for (let i = 0; i < gridCellCountX; i++) {
                if (heightArray[i] > 0) {
                    ctx.fillRect(gridX1 + gridCellWidth * i, gridY2 - gridCellHeight * heightArray[i], gridCellWidth, gridCellHeight * heightArray[i]);
                }
                ctx.fillText(heightArray[i], gridX1 + gridCellWidth * i + gridCellWidth / 2, gridY2 + 20);
            }
            //Width array
            for (var i = 0; i < gridCellCountY; i++) {
                if (widthArray[i] > 0) {
                    ctx.fillRect(gridX2 - gridCellWidth * widthArray[i], gridY1 + gridCellHeight * i, gridCellWidth * widthArray[i], gridCellHeight);
                }
                ctx.fillText(widthArray[i], gridX2 + 10, gridY1 + gridCellHeight * i + gridCellHeight / 2);
            }
            grid.draw();
        }
    });
}
window.addEventListener("load", function () {
    main();
});
