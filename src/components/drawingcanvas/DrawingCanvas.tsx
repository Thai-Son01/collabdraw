import { Client } from '@stomp/stompjs';
import styles from './DrawingCanvas.module.css'
import React, { useState, useEffect, useRef, useCallback } from "react";
import { tool } from '../../interface';

export default function DrawingCanvas({selectedTool, connection, room} : 
                                    {
                                    selectedTool : tool, //trop paresseux de changer type pour l'instant
                                    connection : Client | null,
                                    room : string | null,
                                    }){

    
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCtxRef = useRef<CanvasRenderingContext2D>(null);
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const displayCtxRef = useRef<CanvasRenderingContext2D>(null);
    const [drawingPath, setDrawingPath] = useState<Array<Array<number>>>([]);
    const [isDrawing, setIsDrawing] = useState(false);

    function sendData() {
        if (connection) {
            connection.publish({destination : `/app/coordinates/${room}`,
                body: JSON.stringify({"x" : 1,
                                      "y" : 1,
                                        })
                });
        }
    }
    useEffect(() => {   
        console.log("USE EFFECT IN DRAWING CANVAS IS CALLED");
        //les height et width ne changent jamais? si on change de taille le viewport 
        if(drawingCanvasRef.current){
            drawingCanvasRef.current.width = window.innerWidth;
            drawingCanvasRef.current.height = window.innerHeight;
            const ctx = drawingCanvasRef.current.getContext("2d");
            
            if (ctx){
                //when page hot reloads and eraser was picked, crashes the website because there is no colour
                ctx.lineCap = "round";
                if (selectedTool.colour)
                    ctx.strokeStyle = `rgba(${selectedTool.colour[0]}  
                                          ${selectedTool.colour[1]} 
                                          ${selectedTool.colour[2]} / 
                                          ${selectedTool.opacity}%)`
                drawingCtxRef.current = ctx;
            }
        }

        if(displayCanvasRef.current) {
            displayCanvasRef.current.width = window.innerWidth;
            displayCanvasRef.current.height = window.innerHeight;

            const ctx = displayCanvasRef.current.getContext("2d");
            if (ctx)
                ctx.lineCap = "round";
                displayCtxRef.current = ctx;
        }
        if (!connection?.connected) {
            console.log("why does it return null lol");
        }
        else {
            console.log("IL Y A UNE CONNEXION WHAT THE FUCK MAN");
            console.log(connection.connected);
            connection.subscribe(`/user/queue/${room}`, message => {
                console.log("THIS SHOULD WORK CMON MAN")
                console.log(message);
            })


        }

        }, [connection?.connected])


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


    //i hate it
    function setupTool(e : React.MouseEvent) {
        let context;
        switch(selectedTool.tool) {
            case "pen" : {
                if (drawingCtxRef.current) {
                    context = drawingCtxRef.current;
                    context.globalCompositeOperation = "source-over";
                    displayCtxRef.current!.globalCompositeOperation = "source-over"; //!!
                    if(selectedTool.colour)
                        context.strokeStyle = `rgba(${selectedTool.colour[0]}  
                                                    ${selectedTool.colour[1]} 
                                                    ${selectedTool.colour[2]} / 
                                                    ${selectedTool.opacity}%)`
                }
                break;
            }
            //same problem with eraser when opacity XDDDDD bro do i even want opacity for this then
            case "eraser" : {
                if (displayCtxRef.current && displayCanvasRef.current) {
                    context = displayCtxRef.current;
                    // context.strokeStyle = "rgba(0 0 0 / 10%)";
                    context.globalCompositeOperation = "destination-out";
                    context.beginPath(); // xd this function too big does too many things man
                }
                break;
            }
            default : break;
        }
        context!.lineWidth = selectedTool.width;
            //casting xdddd
        let [startX, startY] = getMousePosition(drawingCanvasRef.current as HTMLCanvasElement, e); //maybe should just give the right canvas here or better yet do we even need to change the canvas here
        draw(startX, startY, selectedTool.tool );
    }


    function draw(xPos : number, yPos : number, currentTool : string) {
        if (currentTool === "eraser") {
            displayCtxRef.current?.lineTo(xPos, yPos);
            displayCtxRef.current?.moveTo(xPos, yPos);
            displayCtxRef.current?.stroke();
        }
        else {
            addPositionToPath([xPos, yPos]);
            refresh();
        }
    
    }

    function refresh() {

        if (drawingCanvasRef.current && drawingCtxRef.current){
            
            drawingCtxRef.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
            drawingCtxRef.current.beginPath();
            for (const drawPoint of drawingPath) {
                drawingCtxRef.current.lineTo(drawPoint[0], drawPoint[1]);
                drawingCtxRef.current.moveTo(drawPoint[0], drawPoint[1]);
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
                    setupTool(e);

                }}
            }

            onMouseMove={(e : React.MouseEvent) => {
                if (drawingCtxRef.current && drawingCanvasRef.current && isDrawing) {

                    let [currentX, currentY] = getMousePosition(drawingCanvasRef.current, e);
                    draw(currentX, currentY, selectedTool.tool);
                    sendData();
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
