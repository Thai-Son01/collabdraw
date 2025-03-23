import { Client } from "@stomp/stompjs";


const url = "ws://localhost:8080/gs-guide-websocket";

export default function connectToWebSocket(userId : string, room : string,  onConnection : () => void, serverUrl : string = url) {
    const headers = {
                    "user-id" : userId,
                    "room" : room
                }
        
    const client = new Client( {
        brokerURL : serverUrl,
        connectHeaders : headers,

        onStompError : (frame) => {
            console.log("wtf is happenign man", frame);
        },
            
        onWebSocketError: (error) => {
            console.log("websocket error", error);
        },

        onConnect: () => {

            client.publish({destination : "/app/connect/" + room,
                    body: JSON.stringify({'name': userId})
                        });
            console.log("connected to server through websocket");
            console.log(client.connected);
            onConnection();

            }

        })
    client.activate()
    return client
}
