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
    heightArray: number[];
    widthArray: number[];
    angleArray: number[];
    outputElement: HTMLInputElement|HTMLTextAreaElement;
    fillColour = "rgba(255, 255, 255, 0.3)";
    tileIndex = 0;

    constructor (canvas: HTMLCanvasElement, grid: Grid, heightArray: number[], widthArray: number[], angleArray: number[], outputElement: HTMLInputElement|HTMLTextAreaElement){
        this.canvas = canvas;
        this.outputElement = outputElement;
        this.grid = grid;
        this.heightArray = heightArray;
        this.widthArray = widthArray;
        this.angleArray = angleArray;
        this.ctx = canvas.getContext("2d");

        this.canvas.addEventListener("mousedown", (e) => {
            if (e.button == 0){
                this.mousePressed = true;
                this.handleClick(e);
                this.drawAll();
            }
        });
        
        window.addEventListener("mouseup", (e) => { //this one uses window so if you click and drag out of the canvas it will still stop drawing
            if (e.button == 0){
                this.mousePressed = false;
                this.updateOutput(this.getJSON());
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
        const rect = this.canvas.getBoundingClientRect();
        
        this.mouseGridIndexX = this.grid.cellXIndexFromCanvasX(mouseEvent.clientX - rect.x);
        this.mouseGridIndexY = this.grid.cellYIndexFromCanvasY(mouseEvent.clientY - rect.y);
        
        //Height array
        for (var i = 0; i < this.grid.cellCountX; i ++){
            if (i < this.mouseGridIndexX){
                if (this.heightArray[i] > this.grid.cellCountX - this.mouseGridIndexY){
                    this.heightArray[i] = this.grid.cellCountX - this.mouseGridIndexY;
                }
            }
            else{
                if (this.heightArray[i] < this.grid.cellCountX - this.mouseGridIndexY){
                    this.heightArray[i] = this.grid.cellCountX - this.mouseGridIndexY;
                }
            }
        }
        //widthArray
        for (var i = 0; i < this.grid.cellCountY; i ++){
            if (i < this.mouseGridIndexY){
                if (this.widthArray[i] > this.grid.cellCountY - this.mouseGridIndexX){
                    this.widthArray[i] = this.grid.cellCountY - this.mouseGridIndexX;
                }
            }
            else{
                if (this.widthArray[i] < this.grid.cellCountY - this.mouseGridIndexX){
                    this.widthArray[i] = this.grid.cellCountY - this.mouseGridIndexX;
                }
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
        }

        //Draw arrays
        //Height array
        for (let i = 0; i < this.grid.cellCountX; i ++){
            if (this.heightArray[i] > 0){
                this.ctx.fillStyle = this.fillColour;
                this.ctx.fillRect(
                    this.grid.x1 + this.grid.cellWidth * i,
                    this.grid.y2 - this.grid.cellHeight * this.heightArray[i],
                    this.grid.cellWidth,
                    this.grid.cellHeight * this.heightArray[i]
                );
            }
            //this.ctx.fillStyle = "white";
            //this.ctx.fillText(this.heightArray[i] as unknown as string, this.grid.x1 + this.grid.cellWidth * i + this.grid.cellWidth / 2, this.grid.y2 + 20);
        }
        //Width array
        for (var i = 0; i < this.grid.cellCountY; i ++){
            if (this.widthArray[i] > 0){
                this.ctx.fillStyle = this.fillColour;
                this.ctx.fillRect(
                    this.grid.x2 - this.grid.cellWidth * this.widthArray[i],
                    this.grid.y1 + this.grid.cellHeight * i,
                    this.grid.cellWidth * this.widthArray[i],
                    this.grid.cellHeight
                );
            }
            //this.ctx.fillStyle = "white";
            //this.ctx.fillText(this.widthArray[i] as unknown as string, this.grid.x2 + 10, this.grid.y1 + this.grid.cellHeight * i + this.grid.cellHeight / 2);
        }

        this.grid.draw();
    }

    getJSON():string {
        return JSON.stringify({
            arrayWidth: this.grid.cellCountX,
            arrayHeight: this.grid.cellCountY,
            widthArray: this.widthArray,
            heightArray: this.heightArray
        }, null, "\t");
    }

    updateOutput(str: string){
        this.outputElement.value = str;
    }
}