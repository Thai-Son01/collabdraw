import { Client } from '@stomp/stompjs';
import styles from './DrawingCanvas.module.css'
import React, { useState, useEffect, useRef, useCallback } from "react";
import {draw, setupTool} from "./drawingEvent.ts"

export default function DrawingCanvas({selectedTool, connection, room} : 
                                    {
                                    selectedTool : any, //trop paresseux de changer type pour l'instant
                                    connection : Client,
                                    room : string
                                    }){

    
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCtxRef = useRef<CanvasRenderingContext2D>(null);
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const displayCtxRef = useRef<CanvasRenderingContext2D>(null);
    const [drawingPath, setDrawingPath] = useState<Array<Array<Number>>>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    
    useEffect(() => {
        if(drawingCanvasRef.current){
            drawingCanvasRef.current.width = window.innerWidth;
            drawingCanvasRef.current.height = window.innerHeight;
            const ctx = drawingCanvasRef.current.getContext("2d");
            
            if (ctx){
                drawingCtxRef.current = ctx;
                ctx.lineCap = "round";
            }
        }

        if(displayCanvasRef.current) {
            displayCanvasRef.current.width = window.innerWidth;
            displayCanvasRef.current.height = window.innerHeight;

            const ctx = displayCanvasRef.current.getContext("2d");
            if (ctx) 
                displayCtxRef.current = ctx;
        }

        }, [])


    function addPositionToPath(position : Array<Number>) {
        let newPath = structuredClone(drawingPath);
        newPath.push(position);
        setDrawingPath(newPath);
    }

    function resetPath() {
        setDrawingPath([]);
    }

    function getMousePosition(canvas : HTMLCanvasElement, event : React.MouseEvent ) : [number, number] {
        let rect = canvas.getBoundingClientRect();
        let scaleX = canvas.width / rect.width;
        let scaleY = canvas.height / rect.height;
        let x = (event.clientX - rect.left) * scaleX;
        let y = (event.clientY - rect.top) * scaleY;
        
        return [x, y];
}


    function setupTool(e : React.MouseEvent,
                        canvas : HTMLCanvasElement,
                    ) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
            switch(selectedTool.tool) {
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
            ctx.lineWidth = selectedTool.width;
            ctx.strokeStyle = selectedTool.colour;                
            let [startX, startY] = getMousePosition(canvas, e);
            ctx.beginPath();
            draw(ctx, startX, startY);
            addPositionToPath([startX, startY]);
        }
    }

    //why ctx as parameter if i know it's always the same one xdd
    function draw(ctx : CanvasRenderingContext2D, xPos : number, yPos : number) {
        ctx.lineTo(xPos, yPos);
        ctx.moveTo(xPos, yPos);
        ctx.stroke();
        addPositionToPath([xPos, yPos]);
    }

    function refresh() {

    }


    return (
    <div>
        <canvas
            ref={displayCanvasRef}
            className={`${styles.bottomCanvas}`}>
        </canvas>

        <canvas
            className ={`${styles.drawingCanvas}`}
            onMouseDown={(e : React.MouseEvent)=> {
                if (!isDrawing && drawingCanvasRef.current) {
                    setIsDrawing(true);
                    setupTool(e, drawingCanvasRef.current)
                }}
            }

            onMouseMove={(e : React.MouseEvent) => {
                if (drawingCtxRef.current && drawingCanvasRef.current && isDrawing) {
                    let [currentX, currentY] = getMousePosition(drawingCanvasRef.current, e);
                    draw(drawingCtxRef.current, currentX, currentY);
                    
                }


            }}

            onMouseUp={() => {
                setIsDrawing(false);
                if (displayCtxRef.current && drawingCanvasRef.current && drawingCtxRef.current){
                    displayCtxRef.current.drawImage(drawingCanvasRef.current, 0,0);
                    drawingCtxRef.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
                    resetPath();
                    
                }
            }}

            onMouseOutCapture={() => {
                if (drawingCtxRef.current && isDrawing)
                    drawingCtxRef.current.closePath();
            }}

            onMouseOverCapture={(e : React.MouseEvent) => {

                if (drawingCtxRef.current && isDrawing) {
                    if (e.buttons != 0)
                        drawingCtxRef.current.beginPath();
                    else
                        setIsDrawing(false);

                        
                }
            }}

            ref = {drawingCanvasRef}
            ></canvas>

    </div>)
    
}
