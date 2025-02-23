import Tool from '../tool/Tool'
import ToolSettings from '../toolsettings/ToolSettings';
import styles from './ToolBar.module.css'
import { useState } from 'react';


export default function ToolBar() {
    const [isSelected, setIsSelected] = useState("");
    const pen = "./pen.svg";
    const eraser = "./eraser.svg";

    function toolOnClick(id : string) {
        setIsSelected(id);
    }
    //need a state here so that we can show options for pen
    return (
    <div 
    className={`${styles.toolBar}`}>
        <Tool 
        sourceName = {pen}
        name = "pen"
        onSelect = {toolOnClick}
        ></Tool>
        <Tool 
        sourceName = {eraser}
        name = "eraser"
        onSelect = {toolOnClick}
        ></Tool>
        <ToolSettings></ToolSettings>
    </div>
    )
}