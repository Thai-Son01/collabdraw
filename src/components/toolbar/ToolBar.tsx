import Tool from '../tool/Tool'
import ToolSettings from '../toolsettings/ToolSettings';
import styles from './ToolBar.module.css'
import {changeValue, tool} from '../../interface'


export default function ToolBar({modifyTool, changeSelectedTool, itemSelected} : 
                                {modifyTool : changeValue,
                                changeSelectedTool : (tool : string) => void,
                                itemSelected : tool
                            }) {

    const pen = "./brush.svg";
    const eraser = "./eraser.svg";
    return (
    <div 
    className={`${styles.toolBar}`}>
        <Tool 
        sourceName = {pen}
        name = "pen"
        selected = {itemSelected.tool === "pen"}
        onSelect = {changeSelectedTool}
        ></Tool>

        <Tool 
        sourceName = {eraser}
        name = "eraser"
        selected = {itemSelected.tool === "eraser"}
        onSelect = {changeSelectedTool}
        ></Tool>

        <ToolSettings
        changeValue = {modifyTool}
        currentTool= {itemSelected}
        ></ToolSettings>
    </div>
    )
}