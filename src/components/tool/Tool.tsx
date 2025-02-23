import styles from "./Tool.module.css"

export default function Tool({sourceName, name, onSelect} : 
                            {sourceName : string, name : string, onSelect : (id : string) => void}) {
    
    return (<img className = {`${styles.toolIcon}`}
        src = {sourceName}
        alt="does not work"
        onClick={() => {
            console.log(`clicked on ${name}`)
            onSelect(name);}}
        ></img>)
}