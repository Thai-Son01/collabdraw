import styles from './DrawingCanvas.module.css'
import React, { useState, useEffect, useRef, useCallback } from "react";

export default function DrawingCanvas({pWidth, selectedTool} : 
                                    {pWidth : number,
                                    selectedTool : string
                                    }){
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    let isDrawing : boolean = false;

    //will need to create functions in here is getting kinda big
    function getMousePosition(canvas : HTMLCanvasElement, event : React.MouseEvent ) : [number, number] {
            let rect = canvas.getBoundingClientRect();
            let scaleX = canvas.width / rect.width;
            let scaleY = canvas.height / rect.height;
            let x = (event.clientX - rect.left) * scaleX;
            let y = (event.clientY - rect.top) * scaleY;
            
            return [x, y];
    }


    function draw(e : React.MouseEvent, ctx : CanvasRenderingContext2D) {
        let [currentX, currentY] = getMousePosition(canvasRef.current as HTMLCanvasElement, e);
        ctx.lineTo(currentX, currentY);
        ctx.moveTo(currentX, currentY)
        ctx.stroke();
    }

    function setupTool(e : React.MouseEvent,
                       ctx : CanvasRenderingContext2D, 
                       tool : string,
                       toolWidth : number) {

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
        ctx.lineCap = "round";
        let [startX, startY] = getMousePosition(canvasRef.current as HTMLCanvasElement, e);
        ctx.moveTo(startX, startY);
        ctx.beginPath();

    }

    useEffect(() => {
        if(canvasRef.current){
            canvasRef.current.focus(); //necessary?
            //has to be done somewhere else
            canvasRef.current.width = window.innerWidth;
            canvasRef.current.height = window.innerHeight;
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) {
                ctx.fillStyle = "rgb(200 0 0)";
                ctx.lineWidth = pWidth;
                ctx.lineCap = "round";                  
                ctxRef.current = ctx;
            }
            }
        }, [])

        //casting everytime...
        //need to fix cursor not totally accurate when clicking. on peut voir que le stroke commence un peu plus loin
        //mouseup outside of canvas. canvas still thinks it's drawing because event is not captured. to fix

        return (<canvas
            className ={`${styles.drawingCanvas}`}
            onMouseDown={(e : React.MouseEvent)=> {
                if (!isDrawing) {
                    isDrawing = true;
                    if (ctxRef.current) {
                        setupTool(e, ctxRef.current, selectedTool, pWidth); //called everytime scuffed?
                        //width is set only when drawing dont know if that is what we want!
                    }
                }
            }}
            onMouseMove={(e : React.MouseEvent) => {
                if (ctxRef.current && isDrawing) {
                    draw(e, ctxRef.current);
                }
            }}
            onMouseUp={() => {
                isDrawing = false;
            }}
            onMouseOutCapture={() => {
                if (ctxRef.current && isDrawing) {
                    ctxRef.current.closePath();
                }
            }}

            onMouseOverCapture={(e : React.MouseEvent) => {
                if (ctxRef.current && isDrawing) {
                    if (e.buttons != 0) {
                        ctxRef.current.beginPath();
                    }
                    else {
                        isDrawing=false;
                    }
                }
            }}
            ref = {canvasRef}
            ></canvas>)
}
