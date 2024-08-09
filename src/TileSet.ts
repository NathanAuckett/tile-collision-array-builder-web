import Grid from "./Grid.js";
import Tile from "./Tile.js";

export default class TileSet {
    image: HTMLImageElement;
    tileWidth: number;
    tileHeight: number;
    tiles: Tile[] = [];
    tileCount: number;
    tileCountX: number;
    tileCountY: number;
    
    constructor (image: HTMLImageElement, tileWidth: number, tileHeight: number){
        this.image = image;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.tileCountX = Math.floor(this.image.width / this.tileWidth);
        this.tileCountY = Math.floor(this.image.height / this.tileHeight);

        this.generateTiles();
    }

    generateTiles(){
        for (let y = 0; y < this.tileCountY; y ++){
            for (let x = 0; x < this.tileCountX; x ++){
                this.tiles.push(
                    new Tile(
                        this.image,
                        this.tileWidth * x,
                        this.tileHeight * y,
                        this.tileWidth,
                        this.tileHeight
                    )
                );
            }
        }

        this.tileCount = this.tiles.length;
        console.log("Tile count", this.tileCount);
    }

    drawTileToCanvas(canvas: HTMLCanvasElement, grid: Grid, tileIndex: number){
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;
        const tile = this.tiles[tileIndex];

        ctx.drawImage(
            tile.image,
            tile.x,
            tile.y,
            tile.width,
            tile.height,
            grid.x1,
            grid.y1,
            grid.width,
            grid.height
        );
    }

    drawTileSetToCanvas(canvas: HTMLCanvasElement, x, y, width = this.image.width, height = this.image.height){
        const ctx = canvas.getContext("2d");
        ctx.imageSmoothingEnabled = false;

        ctx.drawImage(
            this.image,
            x,
            y,
            width,
            height
        );
    }
}