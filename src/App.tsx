import { useState, useEffect, useRef } from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'
import {Client} from '@stomp/stompjs'
import useWebsocketConnection from './websocket'
import throttle from 'lodash.throttle'
import SessionInterface from './components/sessionconnect/SessionInterface'
import { tool } from './interface'

function App() {

const WS_URL = "ws://localhost:8080/gs-guide-websocket";
// const roomIdentifier = useRef("1");
// const userIdentifier = useRef(crypto.randomUUID());
const [isConnected, setIsConnected] = useState(false);
const [connection, setConnection] = useState<Client | null>(null);
const [roomIdentifier, setRoomIdenfitier] = useState<string | null>(null);

//ce truc pourrait meme etre dans un autre fichier je pense
const defaultPen  : tool= {
  "tool" : "pen",
  "width" : 10,
  "opacity" : 100,
  "colour" : [209, 202, 219]
}

const defaultEraser : tool = {
  "tool" : "eraser",
  "width" : 10,
  "opacity" : 100,

}
const inventory = {
  "pen" : defaultPen,
  "eraser" : defaultEraser
}

const [toolInventory, setToolInventory] = useState(inventory);
const [popupVisibility, setPopupVisibility] = useState(false);
const [itemSelected, setItemSelected] = useState("pen"); //id of selected tool

//no idea if useridentifier necessary parce que cest le backend qui cree un id
// const connection = useWebsocketConnection(userIdentifier.current,
//                                           roomIdentifier.current, WS_URL) as Client; //random cast sinon ca chiale


const connect = (roomId : string) => {
  console.log("connect is called");
  //this part breaks because it doesnt like that
  // const connection = useWebsocketConnection("testing",
  //                                           roomId, 
  //                                           WS_URL) as Client; //random cast sinon ca chiale
  console.log("after connect");
  setConnection(connection);
  setRoomIdenfitier(roomId);
  setIsConnected(true);
}

function modifyValue(toolType : string, property : string, value : number | string) {
  let clonedInventory = structuredClone(toolInventory);
  clonedInventory[toolType][property] = value;
  setToolInventory(clonedInventory);
  
}

  function toolOnClick(id : string) {
    setItemSelected(id);
}

function setModal(visibility : boolean) {
  setPopupVisibility(visibility);
}

  return (
    <div>
      <button
      className='shareButton'
      onClick={()=> {
        setPopupVisibility(true);}
      }
      >
        CLICK ME
      </button>

      <ToolBar
      modifyTool = {modifyValue}
      itemSelected= {toolInventory[itemSelected]}
      changeSelectedTool={toolOnClick}
      ></ToolBar>

      <DrawingCanvas
      connection = {connection !== null ? connection : null}
      selectedTool= {toolInventory[itemSelected]} //underlined red mais ca a l'air de marcher
      room = {roomIdentifier !== null? roomIdentifier : null}
      ></DrawingCanvas>
      
      <Chat></Chat>

      <SessionInterface
      changeVisibility={setModal}
      visibility = {popupVisibility}
      connectToSession = {connect}
      isConnected = {isConnected}
      >
      </SessionInterface>

      </div>
  )
}

export default App
