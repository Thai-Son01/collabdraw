import { useState, useEffect} from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'
import {Client} from '@stomp/stompjs'
import SessionInterface from './components/sessionconnect/SessionInterface'
import connectToWebSocket from './websocket'
import inventory from './inventory'

function App() {

const [isConnected, setIsConnected] = useState(false);
const [connection, setConnection] = useState<Client | null>(null);
const [roomIdentifier, setRoomIdenfitier] = useState<string | null>(null);
const [testConnect, setTestConnect] = useState(false);
const [toolInventory, setToolInventory] = useState(inventory);
const [popupVisibility, setPopupVisibility] = useState(false);
const [itemSelected, setItemSelected] = useState("pen"); 

useEffect(() => {

  const currentUrl = new URL(window.location.href);
  const room = currentUrl.searchParams.get("room");

  if (room && !isConnected && !connection) {
    let websocketClient = connectToWebSocket("test_user_id", room, socketIsConnected);
    connect(websocketClient, room);
  }

  return () => {
    disconnect();
  };

}, [])


function socketIsConnected() {
  setTestConnect(true);
}

function connect(client : Client, roomId : string) {
  setConnection(client);
  setRoomIdenfitier(roomId);
  setIsConnected(true);
}

function disconnect() {

  if (connection) {
    connection.deactivate();
    setIsConnected(false);
    setRoomIdenfitier(null);
    setConnection(null);
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
      connected = {testConnect}
      ></DrawingCanvas>
      
      <Chat></Chat>

      <SessionInterface
      changeVisibility={setModal}
      visibility = {popupVisibility}
      connectToSession = {connect}
      disconnectFromSession = {disconnect}
      isConnected = {isConnected}
      room = {roomIdentifier !== null? roomIdentifier : null}
      websocketOnConnect = {socketIsConnected}
      >
      </SessionInterface>

      </div>
  )
}

export default App
