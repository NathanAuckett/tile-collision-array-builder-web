export default class TileSelectCanvasController {
    canvas;
    tileset;
    tileIndexInput;
    constructor(canvas, tileSet, tileIndexInput) {
        this.canvas = canvas;
        this.tileset = tileSet;
        this.tileIndexInput = tileIndexInput;
        this.canvas.addEventListener("mousedown", (e) => { this.handleClick(e); });
    }
    handleClick(event) {
        if (event.button == 0) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - rect.x;
            const mouseY = event.clientY - rect.y;
            let cellX = Math.floor(mouseX / this.tileset.tileWidth);
            if (cellX > this.tileset.tileCountX - 1) {
                cellX = this.tileset.tileCountX - 1;
            }
            let cellY = Math.floor(mouseY / this.tileset.tileHeight);
            if (cellY > this.tileset.tileCountY - 1) {
                cellY = this.tileset.tileCountY - 1;
            }
            const index = cellX + this.tileset.tileCountX * cellY;
            this.tileIndexInput.value = index.toString();
            const createEvent = new Promise((resolve, reject) => {
                const changeEvent = new Event("change");
                resolve(changeEvent);
            });
            createEvent.then((changeEvent) => {
                this.tileIndexInput.dispatchEvent(changeEvent);
            });
        }
    }
}
