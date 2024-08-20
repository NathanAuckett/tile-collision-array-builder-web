export default class GridArrayController {
    mousePressed = false;
    mouseGridIndexX = 0;
    mouseGridIndexY = 0;
    canvas;
    ctx;
    grid;
    tileSet;
    heightArray;
    widthArray;
    angleArray;
    outputElement;
    fillColour = "rgba(255, 255, 255, 0.3)";
    tileIndex = 0;
    constructor(canvas, grid, heightArray, widthArray, angleArray, outputElement) {
        this.canvas = canvas;
        this.outputElement = outputElement;
        this.grid = grid;
        this.heightArray = heightArray;
        this.widthArray = widthArray;
        this.angleArray = angleArray;
        this.ctx = canvas.getContext("2d");
        this.canvas.addEventListener("mousedown", (e) => {
            if (e.button == 0) {
                this.mousePressed = true;
                this.handleClick(e);
                this.drawAll();
            }
        });
        window.addEventListener("mouseup", (e) => {
            if (e.button == 0) {
                this.mousePressed = false;
                this.updateOutput(this.getJSON());
            }
        });
        //Continue drawing if mouse is held and dragged
        this.canvas.addEventListener("mousemove", (e) => {
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
        //calculate angles
        for (var i = 0; i < this.grid.cellCountX - 1; i++) {
            let a = this.calcAngle(this.widthArray[i] * this.grid.cellWidth, this.heightArray[i] * this.grid.cellHeight, this.widthArray[i + 1] * this.grid.cellWidth, this.heightArray[i + 1] * this.grid.cellHeight);
            this.angleArray[i] = a;
        }
    }
    calcAngle(x1, y1, x2, y2, returnDegrees = true) {
        //subtract vectors to get direction vector
        const dirX = x2 - x1;
        const dirY = y2 - y1;
        //get dir in radians
        let dirRad = Math.atan2(dirX, dirY);
        dirRad *= 180 / Math.PI; //becomes a range of -180, 180
        if (returnDegrees) { //convert rad dir to degrees
            let dirDeg = dirRad;
            if (dirDeg < 0) {
                dirDeg = 360 + dirDeg;
            }
            return dirDeg;
        }
        return dirRad;
    }
    //Draws everything to the grid
    drawAll() {
        //Clear frame
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        //Draw tile
        if (this.tileSet) {
            this.tileSet.drawTileToCanvas(this.canvas, this.grid, this.tileIndex);
        }
        //Draw arrays
        //Height array
        for (let i = 0; i < this.grid.cellCountX; i++) {
            if (this.heightArray[i] > 0) {
                this.ctx.fillStyle = this.fillColour;
                this.ctx.fillRect(this.grid.x1 + this.grid.cellWidth * i, this.grid.y2 - this.grid.cellHeight * this.heightArray[i], this.grid.cellWidth, this.grid.cellHeight * this.heightArray[i]);
            }
            //this.ctx.fillStyle = "white";
            //this.ctx.fillText(this.heightArray[i] as unknown as string, this.grid.x1 + this.grid.cellWidth * i + this.grid.cellWidth / 2, this.grid.y2 + 20);
        }
        //Width array
        for (var i = 0; i < this.grid.cellCountY; i++) {
            if (this.widthArray[i] > 0) {
                this.ctx.fillStyle = this.fillColour;
                this.ctx.fillRect(this.grid.x2 - this.grid.cellWidth * this.widthArray[i], this.grid.y1 + this.grid.cellHeight * i, this.grid.cellWidth * this.widthArray[i], this.grid.cellHeight);
            }
            //this.ctx.fillStyle = "white";
            //this.ctx.fillText(this.widthArray[i] as unknown as string, this.grid.x2 + 10, this.grid.y1 + this.grid.cellHeight * i + this.grid.cellHeight / 2);
        }
        //Angle array
        // for (let i = 0; i < this.grid.cellCountX; i ++){
        //     if (this.angleArray[i] > 0){
        //         this.ctx.fillStyle = this.fillColour;
        //     }    
        // }
        this.grid.draw();
    }
    getJSON() {
        return JSON.stringify({
            widthArrayLength: this.grid.cellCountX,
            heightArrayLength: this.grid.cellCountY,
            arrayAngleLength: this.grid.cellCountX,
            widthArray: this.widthArray,
            heightArray: this.heightArray,
            angleArray: this.angleArray
        }, null, "\t");
    }
    updateOutput(str) {
        this.outputElement.value = str;
    }
}
