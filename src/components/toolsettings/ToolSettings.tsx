import styles from './ToolSettings.module.css'


export default function ToolSettings({changeValue, currentTool} : 
                                    {changeValue : any, //a changer
                                    currentTool : any}) //a changer
{

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
        max="1"
        step="0.01"
        value= {currentTool.opacity}
        onChange={(e) => {
            changeValue(currentTool.tool, "opacity", parseFloat(e.target.value)) }
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