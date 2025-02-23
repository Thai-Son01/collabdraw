import styles from "./Tool.module.css"

export default function Tool({sourceName, name, onSelect, selected} : 
                            {sourceName : string, name : string, 
                            onSelect : (id : string) => void,
                            selected : string}
                        ) {
    
    return (<img className = {`${styles.toolIcon}` + `${selected === name ? (" " + styles.selected) : ""}`}
        src = {sourceName}
        alt="does not work"
        onClick={() => {
            console.log(`clicked on ${name}`)
            onSelect(name);}}
        ></img>)
}