import { useState } from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'

function App() {
  const [penWidth, setPenWidth] = useState(100);

  function changeValue(value : number) {
    setPenWidth(value);
  }



  //pen width would be in drawingcanvas as props
  return (
    <>
      <ToolBar
      testing = {changeValue}
      defaultPenWidth = {penWidth}
      ></ToolBar>
      <DrawingCanvas
      pWidth = {penWidth}
      ></DrawingCanvas>
      <Chat></Chat>
    </>
  )
}

export default App
