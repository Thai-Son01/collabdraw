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


        //also getting big need to put in functions
        //casting everytime...
        //need to fix cursor not totally accurate when clicking. on peut voir que le stroke commence un peu plus loin
        
        return (<canvas
            className ={`${styles.drawingCanvas}`}
            onMouseDown={(e : React.MouseEvent)=> {
                if (!isDrawing) {
                    isDrawing = true;
                    let [startX, startY] = getMousePosition(canvasRef.current as HTMLCanvasElement, e);
                    console.log(ctxRef.current);
                    if (ctxRef.current) {
                        //check if is pen or eraser, would need to do switch case i guess to the tool
                        if(selectedTool === "pen"){
                            ctxRef.current.globalCompositeOperation = "source-over";
                            ctxRef.current.lineWidth = pWidth;
                            ctxRef.current.moveTo(startX, startY);
                            ctxRef.current.beginPath();
                        }
                        if(selectedTool === "eraser") {
                            ctxRef.current.globalCompositeOperation="destination-out";
                            ctxRef.current.moveTo(startX, startY);
                            ctxRef.current.beginPath();
                        }
                    }
                }

            }}
            onMouseMove={(e : React.MouseEvent) => {
                if (ctxRef.current && isDrawing) {
                    let [currentX, currentY] = getMousePosition(canvasRef.current as HTMLCanvasElement, e);
                    ctxRef.current.lineTo(currentX, currentY);
                    ctxRef.current.moveTo(currentX, currentY)
                    ctxRef.current.stroke();

                }

            }}
            onMouseUp={() => {
                isDrawing = false;
            }}
            ref = {canvasRef}

            ></canvas>)
}
