export default class Tile {
    image;
    x;
    y;
    width;
    height;
    widthArray;
    heightArray;
    angleArray;
    angleValueSingle = 0;
    angleInitial = 0;
    angleLast = 90;
    angleSmoothFactor = 0.5;
    useAngleArray = true;
    hasCollisionData = false;
    constructor(image, x, y, width, height, grid) {
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
