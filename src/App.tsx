import { useState, useEffect, useRef } from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'
import {Client} from '@stomp/stompjs'
import useWebsocketConnection from './websocket'
import throttle from 'lodash.throttle'
import SessionInterface from './components/sessionconnect/SessionInterface'

function App() {

  const WS_URL = "ws://localhost:8080/gs-guide-websocket";
  // const roomIdentifier = useRef(crypto.randomUUID());
  const roomIdentifier = useRef("1");
  const userIdentifier = useRef(crypto.randomUUID());
  
  const defaultPen = {
    "tool" : "pen",
    "width" : 10,
    "opacity" : 100,
    "colour" : "rgb(209, 202, 219)",

  }

  const defaultEraser = {
    "tool" : "eraser",
    "width" : 10,
    "opacity" : 100,

  }
  //this thing should be an object?
  const [penWidth, setPenWidth] = useState(10);
  const [popupVisibility, setPopupVisibility] = useState(false);
  const [itemSelected, setItemSelected] = useState("pen"); //id of selected tool
  const [currentTool, setCurrentTool] = useState(defaultPen);

  const connection = useWebsocketConnection(userIdentifier.current,
                                           roomIdentifier.current, WS_URL) as Client; //random cast sinon ca chiale


  function modifyToolWidth(value :number) {

  }

  function modifyToolOpacity(value : number) {

  }

  function modifyToolColour(value : string) {

  }

  function changeValue(value : number) {

    setPenWidth(value);
    
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
      onClick={(e)=> {
        setPopupVisibility(true);}
      }
      >
        CLICK ME
      </button>
      <ToolBar
      changePenWidth = {changeValue} //function for slider to change pen
      defaultPenWidth = {penWidth} //sets default value in the slider
      itemSelected= {itemSelected} //uses id to highlight item if selected
      changeSelectedTool={toolOnClick} //changes id of selected item
      ></ToolBar>

      <DrawingCanvas
      connection = {connection}
      selectedTool= {currentTool}
      room = {roomIdentifier.current}
      ></DrawingCanvas>
      
      <Chat></Chat>

      <SessionInterface
      changeVisibility={setModal}
      visibility = {popupVisibility}
      >
      </SessionInterface>

      </div>
  )
}

export default App
