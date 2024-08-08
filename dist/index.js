import Grid from "./Grid.js";
import GridArrayController from "./GridArrayController.js";
import TileSet from "./TileSet.js";
const fileSelect = document.getElementById("fileSelect");
const tileIndexInput = document.getElementById("tileIndex");
tileIndexInput.value = "0";
function main() {
    const canvas = document.getElementById("grid");
    canvas.width = 600;
    canvas.height = 600;
    let selectedImage;
    const grid = new Grid(canvas, 32, 32, canvas.width - 32, canvas.height - 32, 64, 64);
    const heightArray = new Array(grid.cellCountX).fill(0);
    const widthArray = new Array(grid.cellCountY).fill(0);
    const gridArrayController = new GridArrayController(canvas, grid, heightArray, widthArray);
    let tileSet;
    //Draw initial grid
    gridArrayController.drawAll();
    fileSelect.addEventListener("change", (e) => {
        const target = e.target;
        const src = URL.createObjectURL(target.files[0]);
        selectedImage = new Image();
        selectedImage.onload = () => {
            tileSet = new TileSet(selectedImage, 64, 64);
            gridArrayController.tileSet = tileSet;
            gridArrayController.drawAll();
        };
        selectedImage.src = src;
        document.getElementById("tileIndexSpan").style.display = "initial";
    });
    //Handle tile index change
    tileIndexInput.addEventListener("change", (e) => {
        if (tileSet) {
            const target = e.target;
            let value = parseInt(target.value);
            if (value > tileSet.tileCount - 1) {
                value = tileSet.tileCount - 1;
                target.value = value.toString();
            }
            gridArrayController.tileIndex = value;
            gridArrayController.drawAll();
            console.log(value);
        }
    });
}
window.addEventListener("load", function () {
    main();
});
