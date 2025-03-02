import { useRef, useEffect } from 'react';
import styles from './SessionInterface.module.css'

export default function SessionInterface({visibility} : {visibility : boolean}) {
    const dialog = useRef<HTMLDialogElement>(null);
    
    if (visibility) {
        if (dialog.current) {
            dialog.current.showModal();
        }
        else {
            console.log("there is no dialog");
        }
    }

    
    return (<dialog
        className={`${styles.interface}`}
        ref = {dialog}
    >
        <button>close button</button>
        hello
    </dialog>)
}