import styles from './DrawingCanvas.module.css'
import React, { useState, useEffect, useRef, useCallback } from "react";

export default function DrawingCanvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    let ctx : CanvasRenderingContext2D | null = null;
    let isDrawing : boolean = false;
    let startX : number = 0;
    let startY : number = 0;

    //will need to create functions in here
    function getMousePosition(canvas : HTMLCanvasElement, event : React.MouseEvent ) : [number, number] {
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let x = (event.clientX - rect.left) * scaleX;
            let y = (event.clientY - rect.top) * scaleY;
            
            return [x, y];
    }
    useEffect(() => {
        if(canvasRef.current){
            console.log("getting the canvas context");
            canvasRef.current.focus();
            //has to be done somewhere else
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            ctx = canvasRef.current.getContext("2d");
            }
        }, [])
        //also getting big need to put in functions
        //casting everytime...
        //need to fix something about the context too dying when hot reloading
        //need to fix cursor not totally accurate when clicking. on peut voir que le stroke commence un peu plus loin
        return (<canvas
            className ={`${styles.drawingCanvas}`}
            onMouseDown={(e : React.MouseEvent)=> {
                if (!isDrawing) {
                    isDrawing = true;
                    [startX, startY] = getMousePosition(canvasRef.current as HTMLCanvasElement, e);
                    console.log(ctx);
                    if (ctx) {
                        ctx.fillStyle = "rgb(200 0 0)";
                        ctx.lineWidth = 3;
                        ctx.lineCap = "round";
                        ctx.moveTo(startX, startY);
                        ctx.beginPath();
                    }
                }

            }}
            onMouseMove={(e : React.MouseEvent) => {
                if (ctx && isDrawing) {
                    console.log("isdrawing is true");
                    let [currentX, currentY] = getMousePosition(canvasRef.current as HTMLCanvasElement, e);
                    ctx.lineTo(currentX, currentY);
                    ctx.moveTo(currentX, currentY)
                    ctx.stroke();

                }

            }}
            onMouseUp={() => {
                isDrawing = false;
            }}
            ref = {canvasRef}

            ></canvas>)
}

//on mouse click -> start path?
//on mouse down -> get point path
//on mouse up or some -> 