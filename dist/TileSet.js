import Tile from "./Tile.js";
export default class TileSet {
    image;
    tileWidth;
    tileHeight;
    tiles = [];
    tileCount;
    constructor(image, tileWidth, tileHeight) {
        this.image = image;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.generateTiles();
    }
    generateTiles() {
        const tileCountX = this.image.width / this.tileWidth;
        const tileCountY = this.image.height / this.tileHeight;
        for (let y = 0; y < tileCountY; y++) {
            for (let x = 0; x < tileCountX; x++) {
                this.tiles.push(new Tile(this.image, this.tileWidth * x, this.tileHeight * y, this.tileWidth, this.tileHeight));
            }
        }
        this.tileCount = this.tiles.length;
        console.log(this.tiles);
    }
    drawTileToCanvas(canvas, grid, tileIndex) {
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        const tile = this.tiles[tileIndex];
        ctx.drawImage(tile.image, tile.x, tile.y, tile.width, tile.height, grid.x1, grid.y1, grid.width, grid.height);
    }
}
