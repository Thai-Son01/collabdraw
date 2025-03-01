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
    ctx.lineTo(currentX, currentY);
    ctx.moveTo(currentX, currentY)
    ctx.stroke();
    //i guess la fonction ici
    // sendData();
}

function setupTool(e : React.MouseEvent,
                    ctx : CanvasRenderingContext2D, 
                    tool : string,
                    toolWidth : number,
                    canvas : HTMLCanvasElement
                ) {

    switch(tool) {
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
    ctx.lineWidth = toolWidth;
    console.log(`width : ${toolWidth}`);
    ctx.lineCap = "round";
    let [startX, startY] = getMousePosition(canvas, e);
    ctx.beginPath();
    ctx.translate(0.5, 0.5);
    ctx.lineTo(startX, startY);
    ctx.moveTo(startX, startY);
    ctx.stroke();
    // sendData();

}

export {draw, setupTool};