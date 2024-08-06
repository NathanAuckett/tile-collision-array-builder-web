import Grid from "./Grid.js";
import GridArrayController from "./GridArrayController.js";
const fileSelect = document.getElementById("fileSelect");
function main() {
    const canvas = document.getElementById("grid");
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 600;
    const grid = new Grid(canvas, 32, 32, canvas.width - 32, canvas.height - 32, 16, 16);
    let selectedImage;
    const heightArray = new Array(grid.cellCountX).fill(0);
    const widthArray = new Array(grid.cellCountY).fill(0);
    const gridArrayController = new GridArrayController(canvas, grid, heightArray, widthArray);
    //Draw initial grid
    grid.draw();
    fileSelect.addEventListener("change", (e) => {
        console.log(e);
        const target = e.target;
        const src = URL.createObjectURL(target.files[0]);
        console.log(src);
        selectedImage = new Image();
        selectedImage.onload = () => {
            console.log(selectedImage);
            gridArrayController.backgroundImage = selectedImage;
            gridArrayController.drawAll();
        };
        selectedImage.src = src;
    });
}
window.addEventListener("load", function () {
    main();
});
