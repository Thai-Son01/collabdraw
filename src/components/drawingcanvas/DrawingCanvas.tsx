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
    const [drawingPath, setDrawingPath] = useState<Array<Array<number>>>([]);
    const [isDrawing, setIsDrawing] = useState(false);
    
    useEffect(() => {

        //les height et width ne changent jamais? si on change de taille le viewport 
        if(drawingCanvasRef.current){
            drawingCanvasRef.current.width = window.innerWidth;
            drawingCanvasRef.current.height = window.innerHeight;
            const ctx = drawingCanvasRef.current.getContext("2d");
            
            if (ctx){
                ctx.lineCap = "round";
                ctx.strokeStyle = "rgb(209 202 219 50)";
                drawingCtxRef.current = ctx;
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


    function addPositionToPath(position : Array<number>) {
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
            ctx.strokeStyle =   "rgba(209 202 219 / 70%)" //hardcoded but will need to change colour property of tool
            let [startX, startY] = getMousePosition(canvas, e); //maybe should just give the right canvas here or better yet do we even need to change the canvas here
            draw(startX, startY);
        }
    }

    //why ctx as parameter if i know it's always the same one xdd
    function draw(xPos : number, yPos : number) {
        addPositionToPath([xPos, yPos]);
        refresh();
    }

    function refresh() {

        if (drawingCanvasRef.current && drawingCtxRef.current){
            
            drawingCtxRef.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
            drawingCtxRef.current.beginPath();
            for (const drawPoint of drawingPath) {
                drawingCtxRef.current.moveTo(drawPoint[0], drawPoint[1]);
                drawingCtxRef.current.lineTo(drawPoint[0], drawPoint[1]);
            }
            drawingCtxRef.current.stroke();

        }
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
                    setupTool(e, drawingCanvasRef.current);

                }}
            }

            onMouseMove={(e : React.MouseEvent) => {
                if (drawingCtxRef.current && drawingCanvasRef.current && isDrawing) {

                    let [currentX, currentY] = getMousePosition(drawingCanvasRef.current, e);
                    draw(currentX, currentY);   
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
