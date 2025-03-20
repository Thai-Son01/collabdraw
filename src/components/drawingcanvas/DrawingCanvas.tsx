import { Client, IMessage } from '@stomp/stompjs';
import styles from './DrawingCanvas.module.css'
import React, { useState, useEffect, useRef } from "react";
import { drawData, PenStatus, point, tool } from '../../interface';

export default function DrawingCanvas({selectedTool, connection, room} : 
                                    {
                                    selectedTool : tool,
                                    connection : Client | null,
                                    room : string | null,
                                    }){

    
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCtxRef = useRef<CanvasRenderingContext2D>(null);
    
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const displayCtxRef = useRef<CanvasRenderingContext2D>(null);

    const syncCanvasRef = useRef<HTMLCanvasElement>(null);
    const syncCanvasCtxRef = useRef<CanvasRenderingContext2D>(null);

    const otherSyncCanvasRef = useRef<HTMLCanvasElement>(null);
    const otherSyncCanvasCtxRef = useRef<CanvasRenderingContext2D>(null);

    const [syncDrawingPath, setSyncDrawingPath] = useState<Array<Array<number>>>([]);
    const [drawingPath, setDrawingPath] = useState<Array<Array<number>>>([]);

    const [isDrawing, setIsDrawing] = useState(false);
    useEffect(() => {
        console.log("USE EFFECT IN DRAWING CANVAS IS CALLED");
        //les height et width ne changent jamais? si on change de taille le viewport 
        if(drawingCanvasRef.current) {

            setContext(drawingCanvasRef.current, drawingCtxRef, selectedTool);
        }

        if(displayCanvasRef.current) {
            setContext(displayCanvasRef.current, displayCtxRef, selectedTool);
        }

        if(syncCanvasRef.current) {
            setContext(syncCanvasRef.current, syncCanvasCtxRef, selectedTool);
        }

        if(otherSyncCanvasRef.current) {
            setContext(otherSyncCanvasRef.current, otherSyncCanvasCtxRef, selectedTool);
        }
        
    }, []);
    
    useEffect(() => {
    
        if (connection?.connected) {
            connection.subscribe(`/user/queue/${room}`, message => {
                handleSync(message);
            })
        }
        
    }, [connection?.connected]);

    function setContext(canvas: HTMLCanvasElement, contextRef: React.RefObject<CanvasRenderingContext2D | null>, tool: tool) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            setupCanvas(ctx, tool);
            contextRef.current = ctx;
        }
    }

    function setupCanvas(context : CanvasRenderingContext2D, tool : tool) {
        context.lineCap = "round";
        context.lineWidth = tool.width;
        if (tool.colour) {
            context.strokeStyle = `rgba(${tool.colour[0]}  
                                  ${tool.colour[1]} 
                                  ${tool.colour[2]} / 
                                  ${tool.opacity}%)`;
            context.globalCompositeOperation = "source-over";
        }
        else {
            context.globalCompositeOperation = "destination-out";
        }

    }
    function handleSync(message : IMessage) {
        let syncData : drawData = JSON.parse(message.body);
        console.log(syncData);

        if (syncCanvasCtxRef.current && otherSyncCanvasCtxRef.current) {
            let tool : tool = syncData.tool;
            let point : point = syncData.point;
            console.log(typeof syncData.status);
            let status : string = syncData.status.toString();
            console.log(typeof status);
            console.log(typeof PenStatus.LIFTED);
            let test = 0;
            
            //je vais essayer de coder ca pour le pen only pour linstant
            if (status !== "LIFTED") {
                // console.log("ok we are drawing and setting up shit")
                setupCanvas(syncCanvasCtxRef.current, tool);
                setupCanvas(otherSyncCanvasCtxRef.current, tool);
                console.log("X: " + point.x);
                console.log("Y: " + point.y);
                addPositionToPathSync([point.x, point.y]);
                if (syncCanvasRef.current && syncCanvasCtxRef.current){
                    // console.log("inside of if we should be drawing");
                    syncCanvasCtxRef.current.clearRect(0, 0, syncCanvasRef.current.width, syncCanvasRef.current.height);
                    syncCanvasCtxRef.current.beginPath();
                    //ya jamais de point qui sont dessiner XD?
                    // console.log(syncDrawingPath);
                    for (const drawPoint of syncDrawingPath) {
                        // console.log(drawPoint);
                        syncCanvasCtxRef.current.lineTo(drawPoint[0], drawPoint[1]);
                        syncCanvasCtxRef.current.moveTo(drawPoint[0], drawPoint[1]);
                    }
                    syncCanvasCtxRef.current.stroke();
                    // console.log("after stroke");
                    otherSyncCanvasCtxRef.current.clearRect(0, 0, otherSyncCanvasRef.current!.width, otherSyncCanvasRef.current!.height);
                    otherSyncCanvasCtxRef.current.drawImage(syncCanvasRef.current, 0,0);

                }
            }
            else{
                console.log("IS IT IN HERE FOR NO REASON?");
                resetPathSync();
                // displayCtxRef.current!.drawImage(syncCanvasRef.current!, 0,0);
            }
        }
    }

    function sendData(drawData : drawData ) {
        if (connection) {
            connection.publish({destination : `/app/coordinates/${room}`,
                body: JSON.stringify(drawData)
                });
        }
    }

    //duplicaiton code xdd mais bon je vias penser plus tard 
    //for sync
    function addPositionToPathSync(position : Array<number>) {
        let syncNewPath = structuredClone(syncDrawingPath);
        syncNewPath.push(position);
        // console.log(newPath);
        setSyncDrawingPath(syncNewPath);
    }

    function resetPathSync() {
        console.log("THIS IS CALLED WHEN IT SHOULDNT BE");
        setSyncDrawingPath([]);
    }
    //for sync

    //for user
    function addPositionToPath(position : Array<number>) {
        let newPath = structuredClone(drawingPath);
        newPath.push(position);
        setDrawingPath(newPath);
    }

    function resetPath() {
        setDrawingPath([]);
    }
    //for user

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
        switch(selectedTool.tool) {
            case "pen" : {
                if (drawingCtxRef.current) {
                    setupCanvas(drawingCtxRef.current, selectedTool);
                    displayCtxRef.current!.globalCompositeOperation = "source-over"; //!!
                }
                break;
            }

            //same problem with eraser when opacity XDDDDD bro do i even want opacity for this then
            case "eraser" : {
                if (displayCtxRef.current && displayCanvasRef.current) {
                    setupCanvas(displayCtxRef.current, selectedTool)
                    displayCtxRef.current.beginPath(); // xd this function too big does too many things man
                }
                break;
            }
            default : break;
        }

        //casting xdddd
        let [startX, startY] = getMousePosition(drawingCanvasRef.current as HTMLCanvasElement, e); //maybe should just give the right canvas here or better yet do we even need to change the canvas here
        let point : point = {x : startX, y : startY};
        let drawData : drawData = {tool : selectedTool, point : point, status : PenStatus.START};
        draw(startX, startY, selectedTool.tool );
        sendData(drawData);
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

    //should have parameters here parce uqe je voudrais refresh pour different truc
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
    <div className={`${styles.canvasBackground}`}>

        {/* SYNCING WITH BACKEND WHEN IN ROOM CANVAS */}
        <canvas
            ref={otherSyncCanvasRef}
            className={`${styles.bottomCanvas}`}>
        </canvas>

        {/* SYNCING WITH BACKEND WHEN IN ROOM CANVAS */}
        <canvas
            ref={syncCanvasRef}
            className={`${styles.bottomCanvas}`}>
        </canvas>

        {/* REAL DISPLAY CANVAS */}
        <canvas
            ref={displayCanvasRef}
            className={`${styles.bottomCanvas}`}>
        </canvas>
        
        {/* THE CANVAS WE DRAW ON */}
        <canvas
            className ={`${styles.drawingCanvas}`}
            onMouseDown={(e : React.MouseEvent)=> {
                if (!isDrawing && drawingCanvasRef.current && e.button === 0) {
                    
                    setIsDrawing(true);
                    setupTool(e);

                }}
            }

            onMouseMove={(e : React.MouseEvent) => {
                if (drawingCtxRef.current && drawingCanvasRef.current && isDrawing) {

                    let [currentX, currentY] = getMousePosition(drawingCanvasRef.current, e);
                    let point : point = {x : currentX, y : currentY};
                    let drawData : drawData = {tool : selectedTool, point : point, status : PenStatus.MOVING};
                    draw(currentX, currentY, selectedTool.tool);
                    sendData(drawData);
                }


            }}

            onMouseUp={() => {
                setIsDrawing(false);
                if (displayCtxRef.current && drawingCanvasRef.current && drawingCtxRef.current){

                    displayCtxRef.current.drawImage(drawingCanvasRef.current, 0,0);
                    drawingCtxRef.current.clearRect(0, 0, drawingCanvasRef.current.width, drawingCanvasRef.current.height);
                    resetPath();
                    let point : point = {x : 0, y : 0};
                    let drawData : drawData = {tool : selectedTool, point : point, status : PenStatus.LIFTED};
                    sendData(drawData);
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
