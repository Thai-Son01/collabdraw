import { Client } from '@stomp/stompjs';
import styles from './DrawingCanvas.module.css'
import React, { useState, useEffect, useRef, useCallback } from "react";
import {draw, setupTool} from "./drawingEvent.ts"

export default function DrawingCanvas({pWidth, selectedTool, connection, room} : 
                                    {pWidth : number,
                                    selectedTool : string,
                                    connection : Client | null,
                                    room : string
                                    }){

    
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    let isDrawing : boolean = false;
    
    //this will send coordinates only
    //maybe declare in app and then pass as props
    // function sendData() {
    //     if (connection) {
    //         connection.publish({destination : "/app/coordinates/" + room,
    //             body: JSON.stringify({"x" : 1,
    //                                   "y" : 1,
    //                                     })
    //             });
    //     }
    // }

    useEffect(() => {

        if(canvasRef.current){
            canvasRef.current.focus(); //necessary?
            //has to be done somewhere else for initial setup?
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

        //need to fix cursor not totally accurate when clicking. on peut voir que le stroke commence un peu plus loin

        return (<canvas
            className ={`${styles.drawingCanvas}`}
            onMouseDown={(e : React.MouseEvent)=> {
                if (!isDrawing) {
                    isDrawing = true;
                    if (ctxRef.current) {
                        setupTool(e, ctxRef.current, selectedTool, pWidth, canvasRef.current as HTMLCanvasElement); //called everytime scuffed?
                        //width is set only when drawing dont know if that is what we want!
                    }
                }
            }}
            onMouseMove={(e : React.MouseEvent) => {
                if (ctxRef.current && isDrawing) {
                    draw(e, ctxRef.current, canvasRef.current as HTMLCanvasElement);
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
