package com.thonking.collabdrawing;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@Controller
public class CoordinateController {

    @Autowired
    private RoomManager manager;

    @Autowired
    private SimpMessagingTemplate messageSender;

    @MessageMapping("/coordinates/{roomId}")
    public void relayCoordinates(@DestinationVariable String roomId, Coordinates coordinate, StompHeaderAccessor headers) throws Exception {

        send(coordinate, headers);

    }

    //does not work
    private void send(Object payload, StompHeaderAccessor headers) {
        //get user from header
        Principal user = headers.getUser();
        System.out.println("PRINCIPAL USER : " + user.getName());

        if (user != null) {
            String username = user.getName();
            String roomId = manager.getRoomIdFromUser(username);
            Set<String> users = manager.getRoomUsers(roomId);
            List<String> subscribers = users.stream().
                    filter(name -> !name.equals(username)).
                    toList();
            System.out.println("SUBS THAT SHOULD GET THE MESSAGE :  " + subscribers);
            subscribers.forEach(sub -> messageSender.convertAndSendToUser(sub,"/queue/" +roomId, payload));
        }

    }
}
