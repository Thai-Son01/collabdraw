import { useState } from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'

function App() {
  //this thing should be an object?
  const [penWidth, setPenWidth] = useState(10);
  const [itemSelected, setItemSelected] = useState("pen");
  const [opacityLevel, setOpacityLevel] = useState(100);

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
      pWidth = {penWidth}
      selectedTool= {itemSelected}
      ></DrawingCanvas>
      <Chat></Chat>
    </>
  )
}

export default App
