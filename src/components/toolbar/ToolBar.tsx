import Tool from '../tool/Tool'
import styles from './ToolBar.module.css'


export default function ToolBar() {
    const pen = "./pen.svg";
    const eraser = "./eraser.svg";
    //need a state here so that we can show options for pen
    return (
    <div 
    className={`${styles.toolBar}`}>
        <Tool sourceName = {pen}></Tool>
        <Tool sourceName = {eraser}></Tool>
    </div>
    )
}