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
    strokeColour = "red";
    tileIndex = 0;
    anglePrecision = 2;
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
        for (let i = 0; i < this.grid.cellCountX; i++) {
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
        for (let i = 0; i < this.grid.cellCountY; i++) {
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
        for (let i = 0; i < this.grid.cellCountX - 1; i++) {
            let a = this.calcAngle(i * this.grid.cellWidth, this.heightArray[i] * this.grid.cellHeight, (i + 1) * this.grid.cellWidth, this.heightArray[i + 1] * this.grid.cellHeight);
            this.angleArray[i] = parseFloat(a.toFixed(this.anglePrecision));
        }
    }
    calcAngle(x1, y1, x2, y2, returnDegrees = true) {
        //subtract vectors to get direction vector
        const dirX = x2 - x1;
        const dirY = y2 - y1;
        let dirRad = Math.atan2(dirY, dirX); //get dir in radians
        if (returnDegrees) {
            return this.radToDeg(dirRad);
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
        this.grid.draw();
        //Angle array
        this.ctx.strokeStyle = this.strokeColour;
        for (let i = 0; i < this.grid.cellCountX; i++) {
            this.ctx.beginPath();
            let xx = this.grid.x1 + i * this.grid.cellWidth;
            let yy = this.grid.y2 - this.heightArray[i] * this.grid.cellHeight;
            this.ctx.moveTo(xx, yy);
            let x2 = xx + this.grid.cellWidth * Math.cos(this.degToRad(this.angleArray[i]));
            let y2 = yy - this.grid.cellHeight * Math.sin(this.degToRad(this.angleArray[i]));
            this.ctx.lineTo(x2, y2);
            this.ctx.stroke();
        }
    }
    degToRad(angle) {
        return angle * (Math.PI / 180);
    }
    radToDeg(angle) {
        return angle * (180 / Math.PI);
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
    //Debug function
    drawX(x, y, size) {
        this.ctx.beginPath();
        this.ctx.moveTo(x - size, y);
        this.ctx.lineTo(x + size, y);
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
        this.ctx.stroke();
    }
}
