
export default class Grid {
    readonly ctx: CanvasRenderingContext2D;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
    cellCountX: number;
    cellCountY: number;
    cellWidth: number;
    cellHeight: number;

    constructor (canvas: HTMLCanvasElement, x1: number, y1: number, x2: number, y2: number, cellCountX: number, cellCountY: number) {
        this.ctx = canvas.getContext("2d");
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.cellCountX = cellCountX;
        this.cellCountY = cellCountY;

        this.width = this.x2 - this.x1;
        this.height = this.y2 - this.y1;

        this.cellWidth = this.width / this.cellCountX;
        this.cellHeight = this.height / this.cellCountY;
    }
    
    cellXIndexFromCanvasX(_x){
        let result = Math.floor((_x - this.x1) / this.cellWidth);
        
        if (result < 0){
            result = 0;
        }
        else if (result > this.cellCountX){
            result = this.cellCountX;
        }

        return result;
    }

    cellYIndexFromCanvasY(_y){
        let result = Math.floor((_y - this.y1) / this.cellHeight);
        
        if (result < 0){
            result = 0;
        }
        else if (result > this.cellCountY){
            result = this.cellCountY;
        }

        return result;
    }

    draw() {
        this.ctx.beginPath();
        let xx = this.x1;
        let yy = this.y1;
        
        while (xx <= this.x2){
            this.ctx.moveTo(xx, this.y1);
            this.ctx.lineTo(xx, this.y2);
            xx += this.cellWidth;
        }
        while (yy <= this.y2){
            this.ctx.moveTo(this.x1, yy);
            this.ctx.lineTo(this.x2, yy);
            yy += this.cellHeight;
        }
        this.ctx.stroke();
    }
}