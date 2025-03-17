import { useState, useEffect} from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'
import {Client} from '@stomp/stompjs'
import SessionInterface from './components/sessionconnect/SessionInterface'
import { tool } from './interface'
import connectToWebSocket from './websocket'

function App() {

const [isConnected, setIsConnected] = useState(false);
const [connection, setConnection] = useState<Client | null>(null);
const [roomIdentifier, setRoomIdenfitier] = useState<string | null>(null);

//ce truc pourrait meme etre dans un autre fichier je pense
const defaultPen  : tool= {
  tool : "pen",
  width : 10,
  opacity : 100,
  colour : [209, 202, 219]
}

const defaultEraser : tool = {
  tool : "eraser",
  width : 10,
  opacity : 100,

}
const inventory = {
  pen : defaultPen,
  eraser : defaultEraser
}

const [toolInventory, setToolInventory] = useState(inventory);
const [popupVisibility, setPopupVisibility] = useState(false);
const [itemSelected, setItemSelected] = useState("pen"); //id of selected tool
//no idea if useridentifier necessary parce que cest le backend qui cree un id


useEffect(() => {
  const currentUrl = new URL(window.location.href);
  const room = currentUrl.searchParams.get("room");
  if (room) {
    console.log(room);
    let websocketClient = connectToWebSocket("test_user_id", room); //where do i put the url man
    connect(websocketClient, room);
  }

  return () => {
    disconnect();
  };
}, [])

function connect(client : Client, roomId : string) {
  console.log("connect is called");
  setConnection(client);
  setRoomIdenfitier(roomId);
  setIsConnected(true);
  console.log("after connect");
  console.log(client.connected);
}

function disconnect() {

  if (connection) {
    console.log("disconnecting");
    connection.deactivate();
    setIsConnected(false);
    setRoomIdenfitier(null);
    setConnection(null);
    console.log("disconnected");
  }
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
      disconnectFromSession = {disconnect}
      isConnected = {isConnected}
      room = {roomIdentifier !== null? roomIdentifier : null}
      >
      </SessionInterface>

      </div>
  )
}

export default App
