import styles from "./Tool.module.css"

export default function Tool(props : any) {
    //i want a state for the size and colour?


    
    return (<img className = {`${styles.toolIcon}`}
        src = {props.sourceName}
        alt="does not work"
        ></img>)
}