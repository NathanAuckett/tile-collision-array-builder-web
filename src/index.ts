import Grid from "./Grid.js";
import GridArrayController from "./GridArrayController.js";
import TileSelectCanvasController from "./TileSelectCanvasController.js";
import TileSet from "./TileSet.js";

const fileSelect = document.getElementById("fileSelect");
const tileIndexInput = document.getElementById("tileIndex") as HTMLInputElement;
tileIndexInput.value = "0";
const output = document.getElementById("output") as HTMLTextAreaElement;

function main(){
    const gridCanvas = document.getElementById("gridCanvas") as HTMLCanvasElement;
    gridCanvas.width = 600;
    gridCanvas.height = 600;
    const tileSelectCanvas = document.getElementById("tileSelectCanvas") as HTMLCanvasElement;
    tileSelectCanvas.width = 400;
    tileSelectCanvas.height = 200;
    let selectedImage: HTMLImageElement;
    
    const grid = new Grid(gridCanvas, 32, 32, gridCanvas.width - 32, gridCanvas.height - 32, 64, 64);
    const heightArray = new Array(grid.cellCountX).fill(0);
    const widthArray = new Array(grid.cellCountY).fill(0);
    const gridArrayController = new GridArrayController(gridCanvas, grid, heightArray, widthArray, output);
    let tileSelectCanvasController: TileSelectCanvasController;
    let tileSet: TileSet;

    //Draw initial grid
    gridArrayController.drawAll();

    fileSelect.addEventListener("change", (e) => {
        const target = e.target as HTMLInputElement;
        const src = URL.createObjectURL(target.files[0]);
    
        selectedImage = new Image();
        selectedImage.onload = () => {
            tileSet = new TileSet(selectedImage, 64, 64);
            tileSelectCanvasController = new TileSelectCanvasController(tileSelectCanvas, tileSet, tileIndexInput);
            gridArrayController.tileSet = tileSet;
            gridArrayController.drawAll();
            tileSet.drawTileSetToCanvas(tileSelectCanvas, 0, 0);
            tileIndexInput.max = (tileSet.tileCount - 1).toString();
        }
        selectedImage.src = src;
        
        //Unhide hidden elements
        const unhide = document.querySelectorAll(".onlyWhenFile");
        for (const element of unhide){
            element.classList.remove("onlyWhenFile");
        }
    });

    //Handle tile index change
    tileIndexInput.addEventListener("change", (e) => {
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
        }
    });
}

window.addEventListener("load", function(){
    main();
});