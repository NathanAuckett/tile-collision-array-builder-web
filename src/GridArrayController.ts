import Grid from "./Grid.js";
import TileSet from "./TileSet.js";

export default class GridArrayController {
    mousePressed = false;
    mouseGridIndexX = 0;
    mouseGridIndexY = 0;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    grid: Grid;
    tileSet: TileSet;
    outputElement: HTMLInputElement|HTMLTextAreaElement;
    fillColour = "rgba(255, 255, 255, 0.3)";
    strokeColour = "red";
    tileIndex = 0;
    angle = 0;
    anglePrecision = 2;
    angleSmoothFactor = 0.5;
    initialAngle = 0;
    lastAngle = 90;

    constructor (canvas: HTMLCanvasElement, grid: Grid, outputElement: HTMLInputElement|HTMLTextAreaElement){
        this.canvas = canvas;
        this.outputElement = outputElement;
        this.grid = grid;
        this.ctx = canvas.getContext("2d");

        this.canvas.addEventListener("mousedown", (e) => {
            if (e.button == 0){
                this.mousePressed = true;
                this.handleClick(e);
                this.drawAll();
            }
        });

        this.canvas.addEventListener("mouseup", (e) => { //we don't want to update the output unless we stop drawing, window would make releasing mouse anywhere update it
            if (e.button == 0){
                this.updateOutput(this.getJSON());
            }
        });
        
        window.addEventListener("mouseup", (e) => { //this one uses window so if you click and drag out of the canvas it will still stop drawing
            if (e.button == 0){
                this.mousePressed = false;
            }
        });
    
        //Continue drawing if mouse is held and dragged
        this.canvas.addEventListener("mousemove", (e) => {
            if (this.mousePressed){
                this.handleClick(e);
                this.drawAll();
            }
        });
    }
    
    handleClick(mouseEvent: MouseEvent){
        if (this.tileSet){
            this.tileSet.tiles[this.tileIndex].hasCollisionData = true;
            const rect = this.canvas.getBoundingClientRect();
            
            this.mouseGridIndexX = this.grid.cellXIndexFromCanvasX(mouseEvent.clientX - rect.x);
            this.mouseGridIndexY = this.grid.cellYIndexFromCanvasY(mouseEvent.clientY - rect.y);
            
            //Height array
            for (let i = 0; i < this.grid.cellCountX; i ++){
                let heightArray = this.tileSet.tiles[this.tileIndex].heightArray;
                if (i < this.mouseGridIndexX){
                    if (heightArray[i] > this.grid.cellCountX - this.mouseGridIndexY){
                        heightArray[i] = this.grid.cellCountX - this.mouseGridIndexY;
                    }
                }
                else{
                    
                    if (heightArray[i] < this.grid.cellCountX - this.mouseGridIndexY){
                        heightArray[i] = this.grid.cellCountX - this.mouseGridIndexY;
                    }
                }
            }
            //widthArray
            for (let i = 0; i < this.grid.cellCountY; i ++){
                let widthArray = this.tileSet.tiles[this.tileIndex].widthArray;
                if (i < this.mouseGridIndexY){
                    if (widthArray[i] > this.grid.cellCountY - this.mouseGridIndexX){
                        widthArray[i] = this.grid.cellCountY - this.mouseGridIndexX;
                    }
                }
                else{
                    if (widthArray[i] < this.grid.cellCountY - this.mouseGridIndexX){
                        widthArray[i] = this.grid.cellCountY - this.mouseGridIndexX;
                    }
                }
            }
            //calculate angles
            if (this.tileSet.tiles[this.tileIndex].useAngleArray){
                this.calcArrayAngles();

                //Smooth angles by lerping
                this.smoothAngleArray();
            }
        }
    }

    calcArrayAngles(){
        let heightArray = this.tileSet.tiles[this.tileIndex].heightArray;
        let angleArray = this.tileSet.tiles[this.tileIndex].angleArray;
        for (let i = 0; i < this.grid.cellCountX - 1; i ++){
            let a = this.calcAngle(
                i * this.grid.cellWidth,
                heightArray[i] * this.grid.cellHeight,
                (i + 1) * this.grid.cellWidth,
                heightArray[i + 1] * this.grid.cellHeight,
            );
            angleArray[i] = a;
        }

        angleArray[0] = this.initialAngle;
        angleArray[angleArray.length - 1] = this.lastAngle;
    }

    calcAngle(x1, y1, x2, y2, returnDegrees = true){
        //subtract vectors to get direction vector
        const dirX = x2 - x1;
        const dirY = y2 - y1;
        let dirRad = Math.atan2(dirY, dirX); //get dir in radians
        if (returnDegrees){
            return this.radToDeg(dirRad);
        }
        return dirRad;
    }

    smoothAngleArray(){
        if (this.angleSmoothFactor > 0){
            let angleArray = this.tileSet.tiles[this.tileIndex].angleArray;
            for (let i = this.grid.cellCountX - 2; i > 1; i --){
                let prevAngle = angleArray[i + 1];
                let thisAngle = angleArray[i];
                
                thisAngle += this.angleSmoothFactor * (prevAngle - thisAngle);
                
                angleArray[i] = parseFloat(thisAngle.toFixed(this.anglePrecision));
            }
        }
    }

    //Draws everything to the grid
    drawAll(){
        //Clear frame
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );
        
        //Draw tile
        if (this.tileSet){
            this.tileSet.drawTileToCanvas(this.canvas, this.grid, this.tileIndex);
        

            //Draw arrays
            //Height array
            let heightArray = this.tileSet.tiles[this.tileIndex].heightArray;
            for (let i = 0; i < this.grid.cellCountX; i ++){
                if (heightArray[i] > 0){
                    this.ctx.fillStyle = this.fillColour;
                    this.ctx.fillRect(
                        this.grid.x1 + this.grid.cellWidth * i,
                        this.grid.y2 - this.grid.cellHeight * heightArray[i],
                        this.grid.cellWidth,
                        this.grid.cellHeight * heightArray[i]
                    );
                }
                //this.ctx.fillStyle = "white";
                //this.ctx.fillText(this.heightArray[i] as unknown as string, this.grid.x1 + this.grid.cellWidth * i + this.grid.cellWidth / 2, this.grid.y2 + 20);
            }
            //Width array
            let widthArray = this.tileSet.tiles[this.tileIndex].widthArray;
            for (var i = 0; i < this.grid.cellCountY; i ++){
                if (widthArray[i] > 0){
                    this.ctx.fillStyle = this.fillColour;
                    this.ctx.fillRect(
                        this.grid.x2 - this.grid.cellWidth * widthArray[i],
                        this.grid.y1 + this.grid.cellHeight * i,
                        this.grid.cellWidth * widthArray[i],
                        this.grid.cellHeight
                    );
                }
                //this.ctx.fillStyle = "white";
                //this.ctx.fillText(this.widthArray[i] as unknown as string, this.grid.x2 + 10, this.grid.y1 + this.grid.cellHeight * i + this.grid.cellHeight / 2);
            }
        
        
            this.grid.draw();
            
            //Angle array
            if (this.tileSet.tiles[this.tileIndex].useAngleArray){
                let angleArray = this.tileSet.tiles[this.tileIndex].angleArray;
                this.ctx.strokeStyle = this.strokeColour;
                for (let i = 0; i < this.grid.cellCountX; i ++){
                    this.ctx.beginPath();

                    let xx = this.grid.x1 + i * this.grid.cellWidth;
                    let yy = this.grid.y2 - heightArray[i] * this.grid.cellHeight;
                    this.ctx.moveTo(xx, yy);
                    
                    let x2 = xx + this.grid.cellWidth * Math.cos(this.degToRad(angleArray[i]));
                    let y2 = yy - this.grid.cellHeight * Math.sin(this.degToRad(angleArray[i]));
                    this.ctx.lineTo(x2, y2);
                    this.ctx.stroke();
                }
            }
        }
    }

    degToRad(angle: number) {
        return angle * (Math.PI / 180);
    }

    radToDeg(angle: number){
        return angle * (180 / Math.PI);
    }
    
    getJSON():string {
        const output = [];
        for (let i = 0; i < this.tileSet.tiles.length; i ++){
            if (this.tileSet.tiles[i].hasCollisionData){
                const tileData: {
                    tileIndex?: number;
                    useAngleArray?: boolean;
                    widthArray?: number[];
                    heightArray?: number[];
                    angleArray?: number[];
                    angleValueSingle?: number;
                } = {};
                
                tileData.tileIndex = i;
                tileData.widthArray = this.tileSet.tiles[i].widthArray;
                tileData.heightArray = this.tileSet.tiles[i].heightArray;
                tileData.angleArray = this.tileSet.tiles[i].useAngleArray ? this.tileSet.tiles[i].angleArray : [];
                tileData.useAngleArray = this.tileSet.tiles[i].useAngleArray;
                if (!tileData.useAngleArray){
                    tileData.angleValueSingle = this.tileSet.tiles[i].angleValueSingle;
                }

                output.push(tileData);
            }
        }

        return JSON.stringify(output, null, "\t");
    }

    updateOutput(str: string){
        this.outputElement.value = str;
    }

    //Debug function
    drawX(x: number, y: number, size: number){
        this.ctx.beginPath();
        this.ctx.moveTo(x - size, y);
        this.ctx.lineTo(x + size, y);
        this.ctx.moveTo(x, y - size);
        this.ctx.lineTo(x, y + size);
        this.ctx.stroke();
    }
}