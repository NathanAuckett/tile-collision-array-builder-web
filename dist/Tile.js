export default class Tile {
    image;
    x;
    y;
    width;
    height;
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}
