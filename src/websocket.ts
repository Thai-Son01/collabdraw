import { Client } from "@stomp/stompjs";


const url = "ws://localhost:8080/gs-guide-websocket";

export default function connectToWebSocket(userId : string, room : string, serverUrl : string = url) {
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

            //testing purpose
            client.subscribe("/topic/greetings", message => {
            console.log(message);
            });


            console.log(client.connected);

            // client.publish({destination : "/app/hello",
            // body: JSON.stringify({'name': userId})
            //     });
            client.publish({destination : "/app/connect/" + room,
                    body: JSON.stringify({'name': userId})
                        });

            // console.log(`/user/${userId}/queue/${room}`);
            client.subscribe(`/user/queue/${room}`, message => {
                console.log("THIS SHOULD WORK CMON MAN")
                console.log(message);
            })

            console.log("connected to server through websocket");

            }

            //testing purpose

        })
    client.activate()
    return client
}

// export default function useWebsocketConnection(userId : string, room : string, serverUrl : string) {
//     // const connection = useRef<Client>(null);
//     const [websocketConnection, setWebsocketConnection] = useState<Client | null>(null); //xd state?
    

//     useEffect(() => {

//         const headers = {
//             "user-id" : userId,
//             "room" : room
//         }

//         const client = new Client( {
//             brokerURL : serverUrl,
//             connectHeaders : headers,

//             onStompError : (frame) => {
//                 console.log("wtf is happenign man", frame);
//               },
              
//             onWebSocketError: (error) => {
//             console.log("websocket error", error);
//             },

//             onConnect: () => {

//                 //testing purpose
//                 client.subscribe("/topic/greetings", message => {
//                 console.log(message);
//                 });


//                 console.log(client.connected);

//                 // client.publish({destination : "/app/hello",
//                 // body: JSON.stringify({'name': userId})
//                 //     });
//                 client.publish({destination : "/app/connect/" + room,
//                         body: JSON.stringify({'name': userId})
//                             });

//                 // console.log(`/user/${userId}/queue/${room}`);
//                 client.subscribe(`/user/queue/${room}`, message => {
//                     console.log("THIS SHOULD WORK CMON MAN")
//                     console.log(message);
//                 })

//                 console.log("connected to server through websocket");

//                 }

//                 //testing purpose

//             })
//         client.activate()
//         // connection.current = client;
//         setWebsocketConnection(client);

//         return () => {
//             websocketConnection?.deactivate()
//         }
//     }, [])

//     // console.log(connection.current?.connected);
//     // return connection.current;
//     return websocketConnection;
// }