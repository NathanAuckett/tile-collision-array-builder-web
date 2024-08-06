export default class GridArrayDrawer {
    mousePressed = false;
    mouseGridIndexX = 0;
    mouseGridIndexY = 0;
    canvas;
    ctx;
    grid;
    heightArray = [];
    widthArray = [];
    backgroundImage;
    constructor(canvas, grid, heightArray, widthArray) {
        this.canvas = canvas;
        this.grid = grid;
        this.heightArray = heightArray;
        this.widthArray = widthArray;
        this.ctx = canvas.getContext("2d");
        window.addEventListener("mousedown", (e) => {
            if (e.button == 0) {
                this.mousePressed = true;
                this.handleClick(e); //Draw on initial click
                this.drawAll();
            }
        });
        window.addEventListener("mouseup", (e) => {
            if (e.button == 0) {
                this.mousePressed = false;
            }
        });
        //Continue drawing if mouse is held and dragged
        window.addEventListener("mousemove", (e) => {
            if (this.mousePressed) {
                this.handleClick(e);
                this.drawAll();
            }
        });
    }
    handleClick(mouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouseGridIndexX = this.grid.cellXIndexFromCanvasX(mouseEvent.clientX - rect.x);
        this.mouseGridIndexY = this.grid.cellYIndexFromCanvasY(mouseEvent.clientY - rect.y);
        //Height array
        for (var i = 0; i < this.grid.cellCountX; i++) {
            if (i < this.mouseGridIndexX) {
                if (this.heightArray[i] > this.grid.cellCountX - this.mouseGridIndexY) {
                    this.heightArray[i] = this.grid.cellCountX - this.mouseGridIndexY;
                }
            }
            else {
                if (this.heightArray[i] < this.grid.cellCountX - this.mouseGridIndexY) {
                    this.heightArray[i] = this.grid.cellCountX - this.mouseGridIndexY;
                }
            }
        }
        //widthArray
        for (var i = 0; i < this.grid.cellCountY; i++) {
            if (i < this.mouseGridIndexY) {
                if (this.widthArray[i] > this.grid.cellCountY - this.mouseGridIndexX) {
                    this.widthArray[i] = this.grid.cellCountY - this.mouseGridIndexX;
                }
            }
            else {
                if (this.widthArray[i] < this.grid.cellCountY - this.mouseGridIndexX) {
                    this.widthArray[i] = this.grid.cellCountY - this.mouseGridIndexX;
                }
            }
        }
    }
    //Draws everything to the grid
    drawAll() {
        //Draw updated frame
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        //Draw background
        if (this.backgroundImage) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        }
        //Draw arrays
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        //Height array
        for (let i = 0; i < this.grid.cellCountX; i++) {
            if (this.heightArray[i] > 0) {
                this.ctx.fillRect(this.grid.x1 + this.grid.cellWidth * i, this.grid.y2 - this.grid.cellHeight * this.heightArray[i], this.grid.cellWidth, this.grid.cellHeight * this.heightArray[i]);
            }
            this.ctx.fillText(this.heightArray[i], this.grid.x1 + this.grid.cellWidth * i + this.grid.cellWidth / 2, this.grid.y2 + 20);
        }
        //Width array
        for (var i = 0; i < this.grid.cellCountY; i++) {
            if (this.widthArray[i] > 0) {
                this.ctx.fillRect(this.grid.x2 - this.grid.cellWidth * this.widthArray[i], this.grid.y1 + this.grid.cellHeight * i, this.grid.cellWidth * this.widthArray[i], this.grid.cellHeight);
            }
            this.ctx.fillText(this.widthArray[i], this.grid.x2 + 10, this.grid.y1 + this.grid.cellHeight * i + this.grid.cellHeight / 2);
        }
        this.grid.draw();
    }
}
