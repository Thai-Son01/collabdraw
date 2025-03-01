import styles from './ToolSettings.module.css'


export default function ToolSettings({changeValue, defaultValue, currentTool} : 
                                    {changeValue : (value : number) => void, 
                                    defaultValue : number, 
                                    currentTool : string}) {

    return (<div
    className={`${styles.boxSetting}`}
    >
        <input
        type="range"
        min="1"
        max="100"
        value= {defaultValue}
        onChange={(e) => changeValue(Number(e.target.value))}
        >
        </input>

    <div 
    className={`${currentTool === "pen" ? styles.show: styles.hide}`}
    >
        colours will be here</div>
    </div>)
}