import { useRef} from 'react';
import styles from './SessionInterface.module.css'

export default function SessionInterface({visibility, changeVisibility} : 
                                        {visibility : boolean,
                                        changeVisibility : (value : boolean) => void;
                                        }) {
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

    
    return (
    <>
        <dialog
            className={`${styles.sessionDialog}`}
            ref = {dialog}
            onClick={(event) => {

                let rect = dialog.current?.getBoundingClientRect();
                if (rect) {
                    let isInside = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                        rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
                    if (!isInside) {
                        dialog.current?.close();
                        changeVisibility(false);
                    }
                }

            }}
        >
            <button
            onClick={() => {
                dialog.current?.close();
                changeVisibility(false);
            }}
            >close button</button>
        </dialog>
    </>
    )
}