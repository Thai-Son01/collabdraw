import styles from './ToolSettings.module.css'


export default function ToolSettings({changeValue, defaultValue, currentTool} : 
                                    {changeValue : any, 
                                    defaultValue : number, 
                                    currentTool : any}) {

    return (<div
        className={`${styles.boxSetting}`}
    >
        <label>Width</label>
        <input 
        className={`${styles.slider}`}
        type="range"
        min="1"
        max="50"
        value= {currentTool.width}
        //change width here
        onChange={(e) => {
            changeValue(currentTool.tool, "width", parseInt(e.target.value));
        }}
        >

        </input>
        <label>Opacity</label>
        <input 
        className={`${styles.slider}`}
        type="range"
        min="0"
        max="100"
        value= {currentTool.opacity}
        //change opacity here
        onChange={(e) => {
            changeValue(currentTool.tool, "opacity", parseInt(e.target.value)) }
        }
        >
        </input>

        <div 
            className={`${currentTool.tool === "pen" ? styles.show: styles.hide}`}
    >
        <div>RED</div>
        <div>RED</div>
        <div>RED</div>
        <div>RED</div>
        <div>RED</div>
        <div>RED</div>
        <div>RED</div>
        <div>RED</div>
        <div>RED</div>
        </div>
    </div>)
}