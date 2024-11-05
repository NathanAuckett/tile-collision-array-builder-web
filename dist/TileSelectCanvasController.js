export default class TileSelectCanvasController {
    canvas;
    tileset;
    tileIndexInput;
    mousePressed = false;
    blockContextMenu = false;
    offsetX = 0;
    offsetY = 0;
    constructor(canvas, tileSet, tileIndexInput) {
        this.canvas = canvas;
        this.tileset = tileSet;
        this.tileIndexInput = tileIndexInput;
        this.canvas.addEventListener("mousedown", (e) => {
            if (e.button == 0) {
                this.handleClick(e);
            }
            else if (e.button == 2) {
                this.mousePressed = true;
                this.blockContextMenu = true;
            }
        });
        window.addEventListener("contextmenu", (e) => {
            if (this.blockContextMenu) {
                e.preventDefault();
                this.blockContextMenu = false;
            }
        });
        window.addEventListener("mouseup", (e) => {
            if (e.button == 2) {
                this.mousePressed = false;
            }
        });
        //Continue drawing if mouse is held and dragged
        window.addEventListener("mousemove", (e) => {
            if (this.mousePressed) {
                this.offsetX += e.movementX;
                this.offsetY += e.movementY;
                this.tileset.drawTileSetToCanvas(this.canvas, this.offsetX, this.offsetY);
            }
        });
    }
    handleClick(event) {
        if (event.button == 0) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = event.clientX - (rect.x + this.offsetX);
            const mouseY = event.clientY - (rect.y + this.offsetY);
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
            this.tileIndexInput.dispatchEvent(new Event("change"));
        }
    }
}
