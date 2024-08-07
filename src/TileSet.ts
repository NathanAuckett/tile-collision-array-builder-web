import Grid from "./Grid.js";
import Tile from "./Tile.js";

export default class TileSet {
    image: HTMLImageElement;
    tileWidth: number;
    tileHeight: number;
    tiles: Tile[] = [];
    
    constructor (image: HTMLImageElement, tileWidth: number, tileHeight: number){
        this.image = image;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.generateTiles();
    }

    generateTiles(){
        const tileCountX = this.image.width / this.tileWidth;
        const tileCountY = this.image.height / this.tileHeight;

        for (let y = 0; y < tileCountY; y ++){
            for (let x = 0; x < tileCountX; x ++){
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

        console.log(this.tiles);
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
}