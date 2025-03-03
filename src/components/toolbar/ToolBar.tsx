import Tool from '../tool/Tool'
import ToolSettings from '../toolsettings/ToolSettings';
import styles from './ToolBar.module.css'
import { useState } from 'react';


export default function ToolBar({changePenWidth, defaultPenWidth, changeSelectedTool, itemSelected} : 
                                {changePenWidth : any,
                                defaultPenWidth : number, 
                                changeSelectedTool : (tool : string) => void,
                                itemSelected : any
                            }) {

    const pen = "./brush.svg";
    const eraser = "./eraser.svg";
    return (
    <div 
    className={`${styles.toolBar}`}>
        <Tool 
        sourceName = {pen}
        name = "pen" //why am i giving name here
        selected = {itemSelected.tool === "pen"} //i could give the boolean here instead
        //needs so have the settings of pen to change properties, so has to give eraser and pen...
        onSelect = {changeSelectedTool} //right now it's only here for the highlight, does not change the tool properties
        ></Tool>

        <Tool 
        sourceName = {eraser}
        name = "eraser"
        selected = {itemSelected.tool === "eraser"}
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