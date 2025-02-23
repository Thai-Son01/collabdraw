import { useState } from 'react'
import './App.css'
import DrawingCanvas from './components/drawingcanvas/DrawingCanvas'
import Chat from './components/chat/Chat'
import ToolBar from './components/toolbar/ToolBar'

function App() {

  return (
    <>
      <ToolBar></ToolBar>
      <DrawingCanvas></DrawingCanvas>
      <Chat></Chat>
    </>
  )
}

export default App
