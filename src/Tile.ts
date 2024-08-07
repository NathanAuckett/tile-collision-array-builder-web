export default class Tile{
    image: HTMLImageElement;
    x: number;
    y: number;
    width: number;
    height: number;
    
    constructor(image: HTMLImageElement, x: number, y: number, width: number, height: number){
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}