import Grid from "./Grid";

export default class Tile {
    image: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
    widthArray: number[];
    heightArray: number[];
    angleArray: number[];
    angleValueSingle: number = 0;
    useAngleArray = true;
    hasCollisionData: boolean = false;
    
    constructor(image: HTMLImageElement, x: number, y: number, width: number, height: number, grid: Grid){
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.widthArray = new Array(grid.cellCountX).fill(0);
        this.heightArray = new Array(grid.cellCountX).fill(0);
        this.angleArray = new Array(grid.cellCountX).fill(0);
    }
}