import Grid from "./Grid.js";

export default function drawArraysOnGrid(canvas: HTMLCanvasElement, grid: Grid, heightArray:number[], widthArray:number[]){
    let mousePressed = false;
    let mouseGridIndexX = 0;
    let mouseGridIndexY = 0;

    const ctx = canvas.getContext("2d");

    window.addEventListener("mousedown", (e) => {
        if (e.button == 0){
            mousePressed = true;
        }
    });
    
    window.addEventListener("mouseup", (e) => {
        if (e.button == 0){
            mousePressed = false;
        }
    });

    window.addEventListener("mousemove", (e) => {
        if (mousePressed){
            const rect = canvas.getBoundingClientRect();
            mouseGridIndexX = grid.cellXIndexFromCanvasX(e.clientX - rect.x);
            mouseGridIndexY = grid.cellYIndexFromCanvasY(e.clientY - rect.y);
            
            //Height array
            for (var i = 0; i < grid.cellCountX; i ++){
                if (i < mouseGridIndexX){
                    if (heightArray[i] > grid.cellCountX - mouseGridIndexY){
                        heightArray[i] = grid.cellCountX - mouseGridIndexY;
                    }
                }
                else{
                    if (heightArray[i] < grid.cellCountX - mouseGridIndexY){
                        heightArray[i] = grid.cellCountX - mouseGridIndexY;
                    }
                }
            }
            //widthArray
            for (var i = 0; i < grid.cellCountY; i ++){
                if (i < mouseGridIndexY){
                    if (widthArray[i] > grid.cellCountY - mouseGridIndexX){
                        widthArray[i] = grid.cellCountY - mouseGridIndexX;
                    }
                }
                else{
                    if (widthArray[i] < grid.cellCountY - mouseGridIndexX){
                        widthArray[i] = grid.cellCountY - mouseGridIndexX;
                    }
                }
            }

            //Draw updated frame
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            //Draw arrays
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            //Height array
            for (let i = 0; i < grid.cellCountX; i ++){
                if (heightArray[i] > 0){
                    ctx.fillRect(
                        grid.x1 + grid.cellWidth * i,
                        grid.y2 - grid.cellHeight * heightArray[i],
                        grid.cellWidth,
                        grid.cellHeight * heightArray[i]
                    );
                }

                ctx.fillText(heightArray[i] as unknown as string, grid.x1 + grid.cellWidth * i + grid.cellWidth / 2, grid.y2 + 20);
            }
            //Width array
            for (var i = 0; i < grid.cellCountY; i ++){
                if (widthArray[i] > 0){
                    ctx.fillRect(
                        grid.x2 - grid.cellWidth * widthArray[i],
                        grid.y1 + grid.cellHeight * i,
                        grid.cellWidth * widthArray[i],
                        grid.cellHeight
                    );
                }

                ctx.fillText(widthArray[i] as unknown as string, grid.x2 + 10, grid.y1 + grid.cellHeight * i + grid.cellHeight / 2);
            }

            grid.draw();

        }
    });
}