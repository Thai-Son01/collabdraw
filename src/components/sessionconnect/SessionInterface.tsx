import {useRef} from 'react';
import styles from './SessionInterface.module.css'
import {Client} from '@stomp/stompjs'
import connectToWebSocket from '../../websocket';

export default function SessionInterface({visibility, changeVisibility, connectToSession, isConnected, room, disconnectFromSession} : 
                                        {visibility : boolean,
                                        changeVisibility : (value : boolean) => void,
                                        connectToSession : (client : Client ,roomId: string) => void,
                                        isConnected : boolean,
                                        room: string | null,
                                        disconnectFromSession : () => void,
                                        }) {

    const dialog = useRef<HTMLDialogElement>(null);
    const input = useRef<HTMLInputElement>(null);

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
            if (input.current && !input.current.value) {

                let url = new URL(window.location.href);
                url.searchParams.set("room", roomId);

                input.current.value = url.toString();
                history.pushState({}, "", url);
                let websocketClient = connectToWebSocket("test_user_id", roomId);
                
                connectToSession(websocketClient, roomId);
            }
        }
    }

    function getUrl() {
        let url = new URL(window.location.href);
        return url.toString();
    }

    function resetUrl() {
        let url = new URL(window.location.href);
        url.searchParams.delete("room");
        history.pushState({}, "", url);
    }

    function disconnect() {
        disconnectFromSession();
        resetUrl();
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
            <div className={`${styles.inputContainer}`}>
                <input type="text" value = {room != null? getUrl() : "" } placeholder = "link with room id" id = "roomId" readOnly = {true} ref={input}></input>
                <button className={`${styles.clipboardButton}`} onClick={()=>copyToClipBoard()}>Copy link</button>
            </div>

            <div className={`${styles.sessionButtonContainer}`}>

                <button className={`${styles.sessionButton}`}
                    onClick={()=> {
                        if (!isConnected) {
                            handleConnection()
                            }    
                        }
                    }
                > Start session</button>

                <button className={`${styles.sessionButton}`}
                    onClick={()=> {
                        if (isConnected) {
                            disconnect()
                            }    
                        }
                    }
                > Disconnect</button>
            </div>

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