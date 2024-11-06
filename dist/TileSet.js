import Tile from "./Tile.js";
export default class TileSet {
    image;
    tileWidth;
    tileHeight;
    tiles = [];
    tileCount;
    tileCountX;
    tileCountY;
    grid;
    constructor(image, tileWidth, tileHeight, grid) {
        this.image = image;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileCountX = Math.floor(this.image.width / this.tileWidth);
        this.tileCountY = Math.floor(this.image.height / this.tileHeight);
        this.grid = grid;
        this.generateTiles(grid);
    }
    generateTiles(grid) {
        for (let y = 0; y < this.tileCountY; y++) {
            for (let x = 0; x < this.tileCountX; x++) {
                this.tiles.push(new Tile(this.image, this.tileWidth * x, this.tileHeight * y, this.tileWidth, this.tileHeight, grid));
            }
        }
        this.tileCount = this.tiles.length;
        console.log("Tile count", this.tileCount);
    }
    drawTileToCanvas(canvas, grid, tileIndex) {
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        const tile = this.tiles[tileIndex];
        ctx.drawImage(tile.image, tile.x, tile.y, tile.width, tile.height, grid.x1, grid.y1, grid.width, grid.height);
    }
    drawTileSetToCanvas(canvas, x, y, width = this.image.width, height = this.image.height) {
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.image, x, y, width, height);
    }
    JsonExport() {
        const output = [];
        for (let i = 0; i < this.tiles.length; i++) {
            if (this.tiles[i].hasCollisionData) {
                const tileData = {};
                tileData.tileIndex = i;
                tileData.widthArray = this.tiles[i].widthArray;
                tileData.heightArray = this.tiles[i].heightArray;
                tileData.angleArray = this.tiles[i].useAngleArray ? this.tiles[i].angleArray : [];
                tileData.angleInitial = this.tiles[i].angleInitial;
                tileData.angleLast = this.tiles[i].angleLast;
                tileData.angleSmoothFactor = this.tiles[i].angleSmoothFactor;
                tileData.useAngleArray = this.tiles[i].useAngleArray;
                if (!tileData.useAngleArray) {
                    tileData.angleValueSingle = this.tiles[i].angleValueSingle;
                }
                output.push(tileData);
            }
        }
        return JSON.stringify(output, null, "\t");
    }
    JsonIngest(json) {
        if (json) {
            console.log("yes");
            let data = JSON.parse(json);
            for (let i = 0; i < data.length; i++) {
                const inputTile = data[i];
                const index = inputTile.tileIndex;
                const existingTile = this.tiles[index];
                existingTile.widthArray = inputTile.widthArray;
                existingTile.heightArray = inputTile.heightArray;
                existingTile.angleArray = inputTile.useAngleArray ? inputTile.angleArray : new Array(this.grid.cellCountX).fill(0);
                existingTile.useAngleArray = inputTile.useAngleArray;
                existingTile.angleValueSingle = inputTile.angleValueSingle;
                existingTile.angleInitial = inputTile.angleInitial;
                existingTile.angleLast = inputTile.angleLast;
                existingTile.angleSmoothFactor = inputTile.angleSmoothFactor;
                existingTile.hasCollisionData = true;
            }
        }
    }
}
