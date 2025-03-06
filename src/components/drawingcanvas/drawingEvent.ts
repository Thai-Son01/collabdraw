//maybe move all this back in component
function getMousePosition(canvas : HTMLCanvasElement, event : React.MouseEvent ) : [number, number] {
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        let x = (event.clientX - rect.left) * scaleX;
        let y = (event.clientY - rect.top) * scaleY;
        
        return [x, y];
}

//might have to give function here for send data too
//maybe this should take x y coord instead of event
function draw(e : React.MouseEvent, ctx : CanvasRenderingContext2D, canvas : HTMLCanvasElement) {
    let [currentX, currentY] = getMousePosition(canvas, e);
    // paths[paths.length -1].push([currentX, currentY])
    ctx.lineTo(currentX, currentY);
    ctx.moveTo(currentX, currentY)
    ctx.stroke();
    // refresh(ctx, paths, canvas);
    //i guess la fonction ici
    // sendData();
}

function setupTool(e : React.MouseEvent,
                    ctx : CanvasRenderingContext2D, 
                    tool : any,
                    canvas : HTMLCanvasElement,
                ) {

    switch(tool.tool) {
        case "pen" : {
            ctx.globalCompositeOperation = "source-over";
            break;
        }
        case "eraser" : {
            ctx.globalCompositeOperation = "destination-out";
            break;
        }
        default : break;
    }
    ctx.lineWidth = tool.width;
    ctx.strokeStyle = tool.colour;
    let [startX, startY] = getMousePosition(canvas, e);
    // paths.push([[startX, startY]]);
    ctx.beginPath();
    ctx.lineCap = "round";
    ctx.lineTo(startX, startY);
    ctx.moveTo(startX, startY);
    ctx.stroke();
    // sendData();

}


function refresh(ctx : CanvasRenderingContext2D, paths : Array<Array<number>>, canvas : HTMLCanvasElement) {
    // ctx.clearRect(0,0,canvas.width, canvas.height);
    console.log(paths.length);
    for (const path in paths) {

        if (path.length < 1)
            continue;

        // ctx.beginPath();
        // ctx.moveTo(path[0][0], path[0][1]);
        // console.log(path);

    }

}
export {draw, setupTool};