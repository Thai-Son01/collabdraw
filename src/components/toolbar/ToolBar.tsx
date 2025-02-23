import Tool from '../tool/Tool'
import ToolSettings from '../toolsettings/ToolSettings';
import styles from './ToolBar.module.css'
import { useState } from 'react';


export default function ToolBar() {
    const [itemSelected, setItemSelected] = useState("");

    const pen = "./pen.svg";
    const eraser = "./eraser.svg";

    function toolOnClick(id : string) {
        setItemSelected(id);
    }
    return (
    <div 
    className={`${styles.toolBar}`}>
        <Tool 
        sourceName = {pen}
        name = "pen"
        selected = {itemSelected}
        onSelect = {toolOnClick}
        ></Tool>
        <Tool 
        sourceName = {eraser}
        name = "eraser"
        selected = {itemSelected}
        onSelect = {toolOnClick}
        ></Tool>
        <ToolSettings></ToolSettings>
    </div>
    )
}