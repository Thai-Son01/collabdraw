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
  //ce truc pourrait meme etre dans un autre fichier je pense
  const inventory = useRef({
    "pen" : defaultPen,
    "eraser" : defaultEraser
  })

  const inventory2 = {
    "pen" : defaultPen,
    "eraser" : defaultEraser
  }

  const [toolInventory, setToolInventory] = useState(inventory2);
  const [penWidth, setPenWidth] = useState(10);
  const [popupVisibility, setPopupVisibility] = useState(false);
  const [itemSelected, setItemSelected] = useState("pen"); //id of selected tool

  const connection = useWebsocketConnection(userIdentifier.current,
                                           roomIdentifier.current, WS_URL) as Client; //random cast sinon ca chiale

  

  function modifyValue(toolType : string, property : string, value : number | string) {
    let clonedInventory = structuredClone(toolInventory);
    console.log("BEFORE CHANGING");
    console.log(clonedInventory);
    clonedInventory[toolType][property] = value;
    console.log("AFTER CHANGING");
    console.log(clonedInventory);
    // let clonedTool = structuredClone(clonedInventory[toolType]);
    // clonedTool[property] = value;
    setToolInventory(clonedInventory);
    
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
      //ca devrait etre un modify tool en general? pour set le tool
      changePenWidth = {modifyValue} //function for slider to change pen
      //peut juste donner le tool en tant que tel je pense
      defaultPenWidth = {penWidth} //sets default value in the slider
      //same here donner le tool en tant que tel or do i need to keep the id here? might need to keep it
      itemSelected= {toolInventory[itemSelected]} //uses id to highlight item if selected
      changeSelectedTool={toolOnClick} //changes id of selected item
      ></ToolBar>

      <DrawingCanvas
      connection = {connection}
      selectedTool= {toolInventory[itemSelected]} //underlined red mais ca a l'air de marcher
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
