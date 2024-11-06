import Grid from "./Grid.js";
import GridArrayController from "./GridArrayController.js";
import TileSelectCanvasController from "./TileSelectCanvasController.js";
import TileSet from "./TileSet.js";

const fileSelect = document.getElementById("fileSelect");
const output = document.getElementById("output") as HTMLTextAreaElement;

const inputTileIndex = document.getElementById("tileIndex") as HTMLInputElement;
const inputCellCount = document.getElementById("cellCount") as HTMLInputElement;
const inputSingleAngleValue = document.getElementById("singleAngleValue") as HTMLInputElement;
const inputAngle = document.getElementById("angle") as HTMLInputElement;
const inputInitialAngle = document.getElementById("initialAngle") as HTMLInputElement;
const inputLastAngle = document.getElementById("lastAngle") as HTMLInputElement;
const inputSmoothFactor = document.getElementById("smoothFactor") as HTMLInputElement;

function main(){
    const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
    gridCanvas.width = 700;
    gridCanvas.height = 700;
    const tileSelectCanvas = document.getElementById("tileSelectCanvas") as HTMLCanvasElement;
    tileSelectCanvas.width = 512;
    tileSelectCanvas.height = 256;
    let selectedImage: HTMLImageElement;
    
    const grid = new Grid(gridCanvas, 32, 32, gridCanvas.width - 32, gridCanvas.height - 32, parseInt(inputCellCount.value), parseInt(inputCellCount.value));
    let heightArray = new Array(grid.cellCountX).fill(0);
    let widthArray = new Array(grid.cellCountY).fill(0);
    let angleArray = new Array(grid.cellCountX).fill(0);
    let gridArrayController = new GridArrayController(gridCanvas, grid, output);
    let tileSelectCanvasController: TileSelectCanvasController;
    let tileSet: TileSet;

    //Draw initial grid
    gridArrayController.drawAll();

    fileSelect.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const src = URL.createObjectURL(target.files[0]);
    
        selectedImage = new Image();
        selectedImage.onload = () => {
            tileSet = new TileSet(selectedImage, grid.cellCountX, grid.cellCountY, grid);
            tileSelectCanvasController = new TileSelectCanvasController(tileSelectCanvas, tileSet, inputTileIndex);
            gridArrayController.tileSet = tileSet;
            gridArrayController.drawAll();
            tileSet.drawTileSetToCanvas(tileSelectCanvas, 0, 0);
            inputTileIndex.max = (tileSet.tileCount - 1).toString();
        }
        selectedImage.src = src;
        
        //Unhide hidden elements
        const unhide = document.querySelectorAll(".onlyWhenFile");
        for (const element of unhide){
            element.classList.remove("onlyWhenFile");
        }
    });

    //Handle tile index change
    inputTileIndex.addEventListener("change", (e) => {
        if (tileSet){
            const target = e.target as HTMLInputElement;
            let value = parseInt(target.value);
            if (value > tileSet.tileCount - 1){
                value = tileSet.tileCount - 1;
                target.value = value.toString();
            }
            else if (value < 0){
                value = 0;
                target.value = value.toString();
            }
            gridArrayController.tileIndex = value;
            gridArrayController.drawAll();
            gridArrayController.updateOutput(tileSet.JsonExport());
            inputSingleAngleValue.checked = !tileSet.tiles[value].useAngleArray;
            inputInitialAngle.value = tileSet.tiles[value].angleInitial.toString();
            inputLastAngle.value = tileSet.tiles[value].angleLast.toString();
            inputSmoothFactor.value = tileSet.tiles[value].angleSmoothFactor.toString();
            inputSingleAngleValue.dispatchEvent(new Event("change"));
            inputInitialAngle.dispatchEvent(new Event("change"));
            inputLastAngle.dispatchEvent(new Event("change"));
            inputSmoothFactor.dispatchEvent(new Event("change"));
        }
    });

    //Handle grid Cell count changes - not working yet
    inputCellCount.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        let value = parseInt(target.value);
        if (value < 1){
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
        const target = e.target as HTMLInputElement;
        let value = parseInt(target.value);
        if (value > 90){
            value = 90;
            target.value = value.toString();
        }
        else if (value < 0){
            value = 0;
            target.value = value.toString();
        }
        tileSet.tiles[gridArrayController.tileIndex].angleInitial = value;
        //gridArrayController.initialAngle = value;
        gridArrayController.calcArrayAngles();
        gridArrayController.smoothAngleArray();
        gridArrayController.drawAll();
        gridArrayController.updateOutput(tileSet.JsonExport());
    });

    inputLastAngle.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        let value = parseInt(target.value);
        if (value > 90){
            value = 90;
            target.value = value.toString();
        }
        else if (value < 0){
            value = 0;
            target.value = value.toString();
        }
        tileSet.tiles[gridArrayController.tileIndex].angleLast = value;
        //gridArrayController.lastAngle = value;
        gridArrayController.calcArrayAngles();
        gridArrayController.smoothAngleArray();
        gridArrayController.drawAll();
        gridArrayController.updateOutput(tileSet.JsonExport());
    });

    inputSmoothFactor.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        let value = parseFloat(target.value);
        if (value > 1){
            value = 1;
            target.value = value.toString();
        }
        else if (value < 0){
            value = 0;
            target.value = value.toString();
        }
        tileSet.tiles[gridArrayController.tileIndex].angleSmoothFactor = value;
        //gridArrayController.angleSmoothFactor = value;
        gridArrayController.calcArrayAngles();
        gridArrayController.smoothAngleArray();
        gridArrayController.drawAll();
        gridArrayController.updateOutput(tileSet.JsonExport());
    });

    inputAngle.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        let value = parseFloat(target.value);
        if (value > 90){
            value = 90;
            target.value = value.toString();
        }
        else if (value < 0){
            value = 0;
            target.value = value.toString();
        }
        tileSet.tiles[gridArrayController.tileIndex].angleValueSingle = value;
        gridArrayController.updateOutput(tileSet.JsonExport());
        gridArrayController.drawAll();
    });

    inputSingleAngleValue.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const arrayInputDiv = document.getElementById("arrayAngleSettings") as HTMLElement;
        const angleInputDiv = document.getElementById("angleInput") as HTMLElement;
        if (target.checked){
            angleInputDiv.style.display = "initial";
            arrayInputDiv.style.display = "none";
            tileSet.tiles[gridArrayController.tileIndex].useAngleArray = false;
            gridArrayController.updateOutput(tileSet.JsonExport());
        }
        else{
            angleInputDiv.style.display = "none";
            arrayInputDiv.style.display = "initial";
            tileSet.tiles[gridArrayController.tileIndex].useAngleArray = true;
            gridArrayController.updateOutput(tileSet.JsonExport());
        }
        gridArrayController.drawAll();
        gridArrayController.updateOutput(tileSet.JsonExport());
    });

    output.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        tileSet.JsonIngest(target.value);
        gridArrayController.drawAll();
    });
}

window.addEventListener("load", function(){
    main();
});