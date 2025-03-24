package com.thonking.collabdrawing;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.*;

@Controller
public class CanvasSyncController {

    @Autowired
    private RoomManager manager;

    @Autowired
    private SimpMessagingTemplate messageSender;

    @MessageMapping("/get_canvas/{roomId}")
    public void reqSyncUserCanvas(@DestinationVariable String roomId, StompHeaderAccessor headers) throws Exception {
        //asking first  user in the room (most likely the host) for a canvas sync
        String responder = manager.getRoomUsers(roomId).iterator().next();
        //this is the user that requested a canvas sync
        Principal user = headers.getUser();
        System.out.println(user.getName());
        messageSender.convertAndSendToUser(responder,"/queue/canvas_sync_request/" + roomId, user.getName());


    }

    @MessageMapping("/send_canvas/{roomId}")
    public void answerSyncUserCanvas(@DestinationVariable String roomId, @Payload CanvasDataRequest request, StompHeaderAccessor headers) throws Exception{
//        System.out.println(request.toString());
        Principal user = headers.getUser();
        System.out.println("SENDER IS  : " + user.getName());
        System.out.println("inside of send canvas");
        System.out.println(request.getRequester());
        String requester = request.getRequester();
        System.out.println(request.getImage());
        String base64Image = request.getImage();
        messageSender.convertAndSendToUser(requester, "/queue/receive_canvas/" + roomId, base64Image);

    }


    @MessageMapping("/coordinates/{roomId}")
    public void relayCoordinates(@DestinationVariable String roomId, DrawingData data, StompHeaderAccessor headers) throws Exception {
        sendDrawingData(data, headers, roomId);

    }

    private void sendDrawingData(Object payload, StompHeaderAccessor headers, String room) {
        //get user from header
        Principal user = headers.getUser();
        System.out.println("PRINCIPAL USER : " + user.getName());

        if (user != null) {
            String username = user.getName();
//            String roomId = manager.getRoomIdFromUser(username);
            Set<String> users = manager.getRoomUsers(room);
            List<String> subscribers = users.stream().
                    filter(name -> !name.equals(username)).
                    toList();
            System.out.println("SUBS THAT SHOULD GET THE MESSAGE :  " + subscribers);
            subscribers.forEach(sub -> messageSender.convertAndSendToUser(sub,"/queue/" + room, payload));
        }

    }

    private void sendCanvasData(Object payload, StompHeaderAccessor headers) {
        Principal user = headers.getUser();
        System.out.println("PRINCIPAL USER : " + user.getName());
    }
}
