import { Client, IMessage } from '@stomp/stompjs';
import styles from './DrawingCanvas.module.css'
import React, { useState, useEffect, useRef } from "react";
import { drawData, PenStatus, point, tool } from '../../interface';
import * as fflate from 'fflate';
import { gzipSync,  } from 'fflate';

export default function DrawingCanvas({selectedTool, connection, room, connected, needSync} : 
                                    {
                                    selectedTool : tool,
                                    connection : Client | null,
                                    room : string | null,
                                    connected : boolean,
                                    needSync : boolean
                                    }){

    
    const drawingCanvasRef = useRef<HTMLCanvasElement>(null);
    const drawingCtxRef = useRef<CanvasRenderingContext2D>(null);
    
    const displayCanvasRef = useRef<HTMLCanvasElement>(null);
    const displayCtxRef = useRef<CanvasRenderingContext2D>(null);

    const syncCanvasRef = useRef<HTMLCanvasElement>(null);
    const syncCanvasCtxRef = useRef<CanvasRenderingContext2D>(null);

    const otherSyncCanvasRef = useRef<HTMLCanvasElement>(null);
    const otherSyncCanvasCtxRef = useRef<CanvasRenderingContext2D>(null);

    const syncPath = useRef<Array<Array<number>>>([]);

    // const [syncDrawingPath, setSyncDrawingPath] = useState<Array<Array<number>>>([]);
    const [drawingPath, setDrawingPath] = useState<Array<Array<number>>>([]);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isSendingData, setIsSendingData] = useState(false);
    useEffect(() => {
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
    
    //bug where it doesnt connect when refreshing page
    useEffect(() => {
        console.log(`Need sync : ${needSync}`);
        if (connection?.connected) {
            console.log("SUBBING TO EVENT");
            connection.subscribe(`/user/queue/${room}`, message => {
                handleSync(message);
            })
            //send canvas data if asked from another user
            connection.subscribe(`/user/queue/canvas_sync_request/${room}`, message => {
                console.log("REQUESTING SYNC GET");
                console.log(message.body); //requester
                displayCanvasRef.current?.toBlob((blob) => {
                    console.log("IS INSIDE OF BLOB");
                    //need to send now to requester
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        console.log("INSIDE OF ONLOADEND")
                        let res = reader.result as string;
                        let base64data = res.split(',')[1]; //remove the header or something
                        console.log(base64data.length);

                        const u8 = fflate.strToU8(base64data); //convert to u8 (0-255) for each character
                        const compress = fflate.gzipSync(u8); //compress
                        const compress64 = uint8ArrayToBase64(compress); //return back to base64
                        console.log("BEFORE PUBLISHING CANVAS");
                        const compressedCanvas = {image : compress64, requester : message.body.toString()};
                        connection.publish({destination : `/app/send_canvas/${room}`, 
                                            body: JSON.stringify(compressedCanvas)
                        });
                    }
                    reader.readAsDataURL(blob as Blob); //returns base 64

                })
            })
            connection.subscribe(`/user/queue/receive_canvas/${room}`, message => {
                console.log("SYNC RESPONSE GET");
                console.log(message.body); //this is base 64
                const u8Message = base64ToUint8Array(message.body);
                const decompressed = fflate.decompressSync(u8Message);
                const d = fflate.strFromU8(decompressed);
                console.log(d.length);
                const imageSource = `data:image/png;base64,${d}`;
                const image = new Image();
                image.onload = function() {
                    displayCtxRef.current?.drawImage(image, 0, 0);
                }
                image.src = imageSource;

            })

            if (needSync) {
                //send this if user joins room and needs syncing
                connection.publish({destination : `/app/get_canvas/${room}`, body: JSON.stringify("placeholder")});

            }
        }
        
    }, [connected]);

    function base64ToUint8Array(base64 : any) {
        // Decode base64 to binary string
        const binaryString = atob(base64);
        
        // Create a Uint8Array with the length of the binary string
        const uint8Array = new Uint8Array(binaryString.length);
        
        // Fill the Uint8Array with the byte values of the binary string
        for (let i = 0; i < binaryString.length; i++) {
            uint8Array[i] = binaryString.charCodeAt(i);
        }
        
        return uint8Array;
    }

    function uint8ArrayToBase64(uint8Array : any) {
        let binaryString = '';
        for (let i = 0; i < uint8Array.length; i++) {
            binaryString += String.fromCharCode(uint8Array[i]);
        }
        return btoa(binaryString); // Convert the binary string to Base64
    }

    function setContext(canvas: HTMLCanvasElement, contextRef: React.RefObject<CanvasRenderingContext2D | null>, tool: tool) {
        canvas.width = 3840;
        canvas.height = 2160;
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

        if (syncCanvasCtxRef.current && otherSyncCanvasCtxRef.current && syncCanvasRef.current && otherSyncCanvasRef.current) {
            let tool : tool = syncData.tool;
            // console.log(tool);
            let point : point = syncData.point;
            let status : string = syncData.status.toString();
            setupCanvas(syncCanvasCtxRef.current, tool);
            setupCanvas(otherSyncCanvasCtxRef.current, tool);
            
            //beaucoup de repetition XDDD
            if (status !== "LIFTED" && tool.tool === "pen") {
                addPositionToPathSync([point.x, point.y]);
                refresh(syncCanvasRef.current!, syncCanvasCtxRef.current, syncPath.current);
                //copies to the other one at the same time
                otherSyncCanvasCtxRef.current.clearRect(0, 0, otherSyncCanvasRef.current.width, otherSyncCanvasRef.current.height);
                otherSyncCanvasCtxRef.current.drawImage(syncCanvasRef.current, 0,0);
                // syncCanvasRef.current.toBlob((blob) => {
                //     //send blob to server
                //     // console.log(blob);
                // });
                // console.log(syncCanvasCtxRef.current);

            }
            //buncha repetition again 
            //THIS IS REALLY SLOW THERE IS A CLEAR DELAY
            //maybe was overthinkg this. jai meme pas de maniere de tester teehee xdddd
            //lagging as shit boy
            else if (status !== "LIFTED" && tool.tool === "eraser") {
                //copy sync to other sync
                // console.log("inside of eraser");
                otherSyncCanvasCtxRef.current.drawImage(syncCanvasRef.current, 0, 0);

                if (displayCtxRef.current!.globalCompositeOperation !== otherSyncCanvasCtxRef.current.globalCompositeOperation) {
                    displayCtxRef.current!.globalCompositeOperation = otherSyncCanvasCtxRef.current.globalCompositeOperation;
                }
                //stroke in other sync
                otherSyncCanvasCtxRef.current.lineTo(point.x, point.y);
                otherSyncCanvasCtxRef.current.moveTo(point.x, point.y);
                otherSyncCanvasCtxRef.current.stroke();
                displayCtxRef.current?.lineTo(point.x, point.y);
                displayCtxRef.current?.moveTo(point.x, point.y);
                displayCtxRef.current?.stroke();
                //clear sync and copy back to sync
                syncCanvasCtxRef.current.clearRect(0, 0, syncCanvasRef.current.width, syncCanvasRef.current.height);
                syncCanvasCtxRef.current.drawImage(otherSyncCanvasRef.current, 0, 0);
            }

            else{
                //when lifted, put everything on the display
                resetPathSync();
                displayCtxRef.current!.globalCompositeOperation = otherSyncCanvasCtxRef.current.globalCompositeOperation;
                displayCtxRef.current!.drawImage(syncCanvasRef.current, 0,0);
                syncCanvasCtxRef.current.clearRect(0, 0, syncCanvasRef.current.width, syncCanvasRef.current.height);
                otherSyncCanvasCtxRef.current.clearRect(0, 0, otherSyncCanvasRef.current.width, otherSyncCanvasRef.current.height);

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
        let syncNewPath = structuredClone(syncPath.current);
        syncNewPath.push(position);
        syncPath.current = syncNewPath;
    }

    function resetPathSync() {
        syncPath.current = [];
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
            refresh(drawingCanvasRef.current!, drawingCtxRef.current!, drawingPath);
        }
    
    }

    //should have parameters here parce uqe je voudrais refresh pour different truc
    function refresh(canvas : HTMLCanvasElement, context : CanvasRenderingContext2D, path : Array<Array<number>>) {
            
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.beginPath();
            for (const drawPoint of path) {
                context.lineTo(drawPoint[0], drawPoint[1]);
                context.moveTo(drawPoint[0], drawPoint[1]);
            }
            context.stroke();
    }


    return (
    <div className={`${styles.canvasBackground}`}>

        {/* SYNCING WITH BACKEND WHEN IN ROOM CANVAS */}
        <canvas
            ref={otherSyncCanvasRef}
            className={`${styles.otherSync}`}>
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
                    
                    setIsSendingData(true);
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
                    if (isSendingData) {
                        sendData(drawData);
                    }
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
                    if (isSendingData) {
                        sendData(drawData);
                    }
                    setIsSendingData(false);
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
