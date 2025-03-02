import { useRef} from 'react';
import styles from './SessionInterface.module.css'

export default function SessionInterface({visibility} : {visibility : boolean}) {
    const dialog = useRef<HTMLDialogElement>(null);
    
    console.log(visibility);

    if (visibility) {
        if (dialog.current && !dialog.current.open) {
            dialog.current.showModal();
        }
    }
    else {
        if (dialog.current && dialog.current.open) {
            dialog.current.close();
        }
    }

    
    return (<dialog
        className={`${styles.sessionDialog}`}
        ref = {dialog}
    >
        <button>close button</button>
    </dialog>)
}