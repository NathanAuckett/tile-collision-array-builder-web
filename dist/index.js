import Grid from "./Grid.js";
import GridArrayController from "./GridArrayController.js";
import TileSelectCanvasController from "./TileSelectCanvasController.js";
import TileSet from "./TileSet.js";
const fileSelect = document.getElementById("fileSelect");
const output = document.getElementById("output");
const inputTileIndex = document.getElementById("tileIndex");
const inputCellCount = document.getElementById("cellCount");
const inputSingleAngleValue = document.getElementById("singleAngleValue");
const inputAngle = document.getElementById("angle");
const inputInitialAngle = document.getElementById("initialAngle");
const inputLastAngle = document.getElementById("lastAngle");
const inputSmoothFactor = document.getElementById("smoothFactor");
function main() {
    const gridCanvas = document.getElementById("gridCanvas");
    gridCanvas.width = 700;
    gridCanvas.height = 700;
    const tileSelectCanvas = document.getElementById("tileSelectCanvas");
    tileSelectCanvas.width = 512;
    tileSelectCanvas.height = 256;
    let selectedImage;
    const grid = new Grid(gridCanvas, 32, 32, gridCanvas.width - 32, gridCanvas.height - 32, parseInt(inputCellCount.value), parseInt(inputCellCount.value));
    let heightArray = new Array(grid.cellCountX).fill(0);
    let widthArray = new Array(grid.cellCountY).fill(0);
    let angleArray = new Array(grid.cellCountX).fill(0);
    let gridArrayController = new GridArrayController(gridCanvas, grid, output);
    let tileSelectCanvasController;
    let tileSet;
    //Draw initial grid
    gridArrayController.drawAll();
    fileSelect.addEventListener("change", (e) => {
        const target = e.target;
        const src = URL.createObjectURL(target.files[0]);
        selectedImage = new Image();
        selectedImage.onload = () => {
            tileSet = new TileSet(selectedImage, grid.cellCountX, grid.cellCountY, grid);
            tileSelectCanvasController = new TileSelectCanvasController(tileSelectCanvas, tileSet, inputTileIndex);
            gridArrayController.tileSet = tileSet;
            gridArrayController.drawAll();
            tileSet.drawTileSetToCanvas(tileSelectCanvas, 0, 0);
            inputTileIndex.max = (tileSet.tileCount - 1).toString();
        };
        selectedImage.src = src;
        //Unhide hidden elements
        const unhide = document.querySelectorAll(".onlyWhenFile");
        for (const element of unhide) {
            element.classList.remove("onlyWhenFile");
        }
    });
    //Handle tile index change
    inputTileIndex.addEventListener("change", (e) => {
        if (tileSet) {
            const target = e.target;
            let value = parseInt(target.value);
            if (value > tileSet.tileCount - 1) {
                value = tileSet.tileCount - 1;
                target.value = value.toString();
            }
            else if (value < 0) {
                value = 0;
                target.value = value.toString();
            }
            gridArrayController.tileIndex = value;
            gridArrayController.drawAll();
            gridArrayController.updateOutput(gridArrayController.getJSON());
            console.log("checked", tileSet.tiles[value].useAngleArray);
            inputSingleAngleValue.checked = !tileSet.tiles[value].useAngleArray;
            inputSingleAngleValue.dispatchEvent(new Event("change"));
        }
    });
    //Handle grid Cell count changes - not working yet
    inputCellCount.addEventListener("change", (e) => {
        const target = e.target;
        let value = parseInt(target.value);
        if (value < 1) {
            value = 1;
            target.value = value.toString();
        }
        grid.setCellCountX(value);
        grid.setCellCountY(value);
        heightArray = new Array(grid.cellCountX).fill(0);
        widthArray = new Array(grid.cellCountY).fill(0);
        angleArray = new Array(grid.cellCountX).fill(0);
        gridArrayController = new GridArrayController(gridCanvas, grid, output);
        gridArrayController.drawAll();
    });
    inputInitialAngle.addEventListener("change", (e) => {
        const target = e.target;
        let value = parseInt(target.value);
        if (value > 90) {
            value = 90;
            target.value = value.toString();
        }
        else if (value < 0) {
            value = 0;
            target.value = value.toString();
        }
        gridArrayController.initialAngle = value;
        gridArrayController.calcArrayAngles();
        gridArrayController.smoothAngleArray();
        gridArrayController.drawAll();
    });
    inputLastAngle.addEventListener("change", (e) => {
        const target = e.target;
        let value = parseInt(target.value);
        if (value > 90) {
            value = 90;
            target.value = value.toString();
        }
        else if (value < 0) {
            value = 0;
            target.value = value.toString();
        }
        gridArrayController.lastAngle = value;
        gridArrayController.calcArrayAngles();
        gridArrayController.smoothAngleArray();
        gridArrayController.drawAll();
    });
    inputSmoothFactor.addEventListener("change", (e) => {
        const target = e.target;
        let value = parseFloat(target.value);
        if (value > 1) {
            value = 1;
            target.value = value.toString();
        }
        else if (value < 0) {
            value = 0;
            target.value = value.toString();
        }
        gridArrayController.angleSmoothFactor = value;
        gridArrayController.calcArrayAngles();
        gridArrayController.smoothAngleArray();
        gridArrayController.drawAll();
    });
    inputAngle.addEventListener("change", (e) => {
        const target = e.target;
        let value = parseFloat(target.value);
        if (value > 90) {
            value = 90;
            target.value = value.toString();
        }
        else if (value < 0) {
            value = 0;
            target.value = value.toString();
        }
        tileSet.tiles[gridArrayController.tileIndex].angleValueSingle = value;
        gridArrayController.updateOutput(gridArrayController.getJSON());
        gridArrayController.drawAll();
    });
    inputSingleAngleValue.addEventListener("change", (e) => {
        const target = e.target;
        console.log(target.checked);
        const arrayInputDiv = document.getElementById("arrayAngleSettings");
        const angleInputDiv = document.getElementById("angleInput");
        if (target.checked) {
            angleInputDiv.style.display = "initial";
            arrayInputDiv.style.display = "none";
            tileSet.tiles[gridArrayController.tileIndex].useAngleArray = false;
            gridArrayController.updateOutput(gridArrayController.getJSON());
        }
        else {
            angleInputDiv.style.display = "none";
            arrayInputDiv.style.display = "initial";
            tileSet.tiles[gridArrayController.tileIndex].useAngleArray = true;
            gridArrayController.updateOutput(gridArrayController.getJSON());
        }
        gridArrayController.drawAll();
        gridArrayController.updateOutput(gridArrayController.getJSON());
    });
}
window.addEventListener("load", function () {
    main();
});
