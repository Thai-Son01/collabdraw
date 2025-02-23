import Tool from '../tool/Tool'
import ToolSettings from '../toolsettings/ToolSettings';
import styles from './ToolBar.module.css'
import { useState } from 'react';


export default function ToolBar({testing, defaultPenWidth} : {testing : (value : number) => void, defaultPenWidth : number}) {
    const [itemSelected, setItemSelected] = useState("");
    // const [penWidth, setPenWidth] = useState(100);

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

        <ToolSettings
        defaultValue = {defaultPenWidth}
        changeValue = {testing}
        ></ToolSettings>
    </div>
    )
}