import { useRef} from 'react';
import styles from './SessionInterface.module.css'

export default function SessionInterface({visibility, changeVisibility, connectToSession, isConnected} : 
                                        {visibility : boolean,
                                        changeVisibility : (value : boolean) => void,
                                        connectToSession : (roomId: string) => void,
                                        isConnected : boolean,
                                        }) {

    const dialog = useRef<HTMLDialogElement>(null);
    const input = useRef<HTMLInputElement>(null);

    console.log(isConnected);
    if (visibility) {
        if (dialog.current && !dialog.current.open) {
            dialog.current.showModal();
        }
    }
    
    function isInsideBounds(event : React.MouseEvent) {
        let rect = dialog.current?.getBoundingClientRect();
        if (rect) {
            let isInside = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
                rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
            if (!isInside) {
                dialog.current?.close();
                changeVisibility(false);
            }
        }
    }

    function copyToClipBoard() {
        if (input.current) {
            input.current.select();
            navigator.clipboard.writeText(input.current.value);
        }
    }

    function handleConnection() {
        if (!isConnected) {
            const roomId = crypto.randomUUID();
            if (input.current) {
                input.current.value = roomId;           
            }
            connectToSession(roomId);
        }
    }

    return (
    <div className={`${styles.container}`}>
        <dialog
            className={`${styles.sessionDialog}`}
            ref = {dialog}
            onClick={(event) => {
                isInsideBounds(event);
            }}
        >   
            {/* should only appear when session is started */}
            <div className={`${styles.inputContainer}`}>
                <input type="text" value = "link with room id" id = "roomId" readOnly = {true} ref={input}></input>
                <button className={`${styles.clipboardButton}`} onClick={()=>copyToClipBoard()}>Copy link</button>
            </div>
            <button className={`${styles.sessionButton}`}
            onClick={()=> {
                if (!isConnected) {
                    const roomId = crypto.randomUUID();
                    if (input.current) {
                        input.current.value = roomId;           
                    }
                    connectToSession(roomId);
                }
                // if (!isConnected) {
                //     handleConnection()
                //     }    
                // }
                }
            }
            > Start session</button>
                
            <button className={`${styles.closeButton}`}
            
                onClick={() => {
                    dialog.current?.close();
                    changeVisibility(false);
                }}
            >
            </button>
        </dialog>
    </div>
    )
}