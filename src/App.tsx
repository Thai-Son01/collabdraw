import { useState, useEffect, useRef } from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'
import {Client} from '@stomp/stompjs'
import useWebsocketConnection from './websocket'
import throttle from 'lodash.throttle'

function App() {

  const WS_URL = "ws://localhost:8080/gs-guide-websocket";
  // const roomIdentifier = useRef(crypto.randomUUID());
  const roomIdentifier = useRef("1");
  const userIdentifier = useRef(crypto.randomUUID());
  
  //this thing should be an object?
  const [penWidth, setPenWidth] = useState(10);
  const [itemSelected, setItemSelected] = useState("pen");
  const [opacityLevel, setOpacityLevel] = useState(100);

  const connection = useWebsocketConnection(userIdentifier.current,
                                           roomIdentifier.current, WS_URL) as Client; //random cast sinon ca chiale

  function changeValue(value : number) {
    setPenWidth(value);
    
  }
  function toolOnClick(id : string) {
    setItemSelected(id);
}


  return (
    <>
      <ToolBar
      changePenWidth = {changeValue}
      defaultPenWidth = {penWidth}
      itemSelected= {itemSelected}
      changeSelectedTool={toolOnClick}
      ></ToolBar>

      <DrawingCanvas
      connection = {connection}
      pWidth = {penWidth}
      selectedTool= {itemSelected}
      room = {roomIdentifier.current}
      ></DrawingCanvas>
      
      <Chat></Chat>
    </>
  )
}

export default App
