import { useState, useEffect, useRef } from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'
import {Client} from '@stomp/stompjs'
import useWebsocketConnection from './websocket'
import throttle from 'lodash.throttle'

function App() {

  //this is really ugly
  //need to remove websocket from the component
  const WS_URL = "ws://localhost:8080/gs-guide-websocket";
  // const [websocketConnection, setWebsocketConnection] = useState<Client | null>(null); //xd state?
  const roomIdentifier = useRef(crypto.randomUUID());
  const userIdentifier = useRef(crypto.randomUUID());
  
  //this thing should be an object?
  const [penWidth, setPenWidth] = useState(10);
  const [itemSelected, setItemSelected] = useState("pen");
  const [opacityLevel, setOpacityLevel] = useState(100);

  const connection = useWebsocketConnection(userIdentifier.current,
                                           roomIdentifier.current, WS_URL);
  // useEffect(() => {
  //   const client = new Client({

  //     brokerURL: WS_URL,

  //     connectHeaders : {
  //       "user-id" : userIdentifier.current,
  //       "room" : roomIdentifier.current
  //     },

  //     onStompError : (frame) => {
  //       console.log("wtf is happenign man", frame);
  //     },
      
  //     onWebSocketError: (error) => {
  //       console.log("websocket error", error);
  //     },
  //     onConnect: () => {
  //       client.subscribe("/topic/greetings", message => {
  //         console.log(message);
  //         }
  //       );
  //       console.log(client.connected);

  //       client.publish({destination : "/app/hello",
  //         body: JSON.stringify({'name': userIdentifier.current})
  //         });
  //       client.publish({destination: "/app/connect/" + roomIdentifier.current,
  //         body : JSON.stringify({"name" : userIdentifier.current})
  //       });

  //       console.log("connected to server through websocket");
  //     },
      
  //   });
  //   client.activate();
  //   setWebsocketConnection(client);

  //   return () => {
  //     //cleanup here do i need to?
  //     websocketConnection?.deactivate();
  //   }
  // }, [])

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
