import Tool from '../tool/Tool'
import ToolSettings from '../toolsettings/ToolSettings';
import styles from './ToolBar.module.css'
import { useState } from 'react';


export default function ToolBar({changePenWidth, defaultPenWidth, changeSelectedTool, itemSelected} : 
                                {changePenWidth : (value : number) => void,
                                defaultPenWidth : number, 
                                changeSelectedTool : (tool : string) => void,
                                itemSelected : string
                            }) {

    const pen = "./brush.svg";
    const eraser = "./eraser.svg";
    return (
    <div 
    className={`${styles.toolBar}`}>
        <Tool 
        sourceName = {pen}
        name = "pen"
        selected = {itemSelected}
        onSelect = {changeSelectedTool}
        ></Tool>

        <Tool 
        sourceName = {eraser}
        name = "eraser"
        selected = {itemSelected}
        onSelect = {changeSelectedTool}
        ></Tool>

        <ToolSettings
        defaultValue = {defaultPenWidth}
        changeValue = {changePenWidth}
        currentTool= {itemSelected}
        ></ToolSettings>
    </div>
    )
}