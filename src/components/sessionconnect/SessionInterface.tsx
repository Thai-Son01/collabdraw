import styles from './SessionInterface.module.css'

export default function SessionInterface({visibility} : {visibility : boolean}) {
    return (<div
        className={`${styles.interface} + ${visibility ? styles.show: styles.hide}`}
    >
        {/* <button></button> */}
        hello
    </div>)
}