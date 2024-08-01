export default class Grid {
    ctx;
    x1;
    y1;
    x2;
    y2;
    cellW;
    cellH;
    constructor(canvas, x1, y1, x2, y2, cellW, cellH) {
        this.ctx = canvas.getContext("2d");
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.cellW = cellW;
        this.cellH = cellH;
    }
    draw() {
        this.ctx.beginPath();
        let xx = this.x1;
        let yy = this.y1;
        while (xx <= this.x2) {
            this.ctx.moveTo(xx, this.y1);
            this.ctx.lineTo(xx, this.y2);
            xx += this.cellW;
        }
        while (yy <= this.y2) {
            this.ctx.moveTo(this.x1, yy);
            this.ctx.lineTo(this.x2, yy);
            yy += this.cellH;
        }
        this.ctx.stroke();
    }
}
