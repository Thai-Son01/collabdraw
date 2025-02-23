import styles from './ToolSettings.module.css'


export default function ToolSettings({changeValue, defaultValue} : {changeValue : (value : number) => void, defaultValue : number}) {

    return (<div
    className={`${styles.boxSetting}`}
    >
        <input
        type="range"
        min="0"
        max="100"
        value= {defaultValue}
        onChange={(e) => changeValue(Number(e.target.value))}
        >
        </input>
    </div>)
}