import { useState, useEffect, useRef } from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'
import {Client} from '@stomp/stompjs'
import throttle from 'lodash.throttle'

function App() {
  const WS_URL = "ws://localhost:8080/gs-guide-websocket";
  const [websocketConnection, setWebsocketConnection] = useState<Client | null>(null); //xd state?
  //this thing should be an object?
  const [penWidth, setPenWidth] = useState(10);
  const [itemSelected, setItemSelected] = useState("pen");
  const [opacityLevel, setOpacityLevel] = useState(100);


  // const {sendJsonMessage, lastJsonMessage} = useWebSocket(WS_URL, {
  //   onOpen : () => console.log("websocket opened"),
  //   share:true
  // })

  const THROTTLE = 50
  // const sendJsonMessageThrottled = useRef(throttle(sendJsonMessage, THROTTLE))

  useEffect(() => {
    const client = new Client({

      brokerURL: WS_URL,

      connectHeaders : {
        "user-id" : "testing id",
        "room" : "1"
      },

      onStompError : (frame) => {
        console.log("wtf is happenign man", frame);
      },
      
      onWebSocketError: (error) => {
        console.log("websocket error", error);
      },
      onConnect: () => {
        client.subscribe("/topic/greetings", message => {
          console.log(message);
          }
        );
        console.log(client.connected);

        client.publish({destination : "/app/hello",
          body: JSON.stringify({'name': "WHAT IS UP"})
          });
        client.publish({destination: "/app/connect/1",
          body : JSON.stringify({"name" : "testing id"})
        });

        console.log("connected to server through websocket");
      },
      
    });
    client.activate();
    setWebsocketConnection(client);

    return () => {
      //cleanup here do i need to?
    }
  }, [])

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
      connection = {websocketConnection}
      pWidth = {penWidth}
      selectedTool= {itemSelected}
      ></DrawingCanvas>
      
      <Chat></Chat>
    </>
  )
}

export default App
