import { tool } from "./interface"

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
export default inventory