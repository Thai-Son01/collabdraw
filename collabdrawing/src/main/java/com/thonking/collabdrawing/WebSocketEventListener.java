package com.thonking.collabdrawing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.GenericMessage;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.AbstractMap;
import java.util.List;

import static java.util.Objects.isNull;
import static java.util.Objects.nonNull;

@Component
public class WebSocketEventListener {

    @Autowired
    private RoomManager manager;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        System.out.println("disconnected");
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal quitter = accessor.getUser();

        if (quitter != null) {
            String username = accessor.getUser().getName();
            String roomId = manager.getRoomIdFromUser(username);
            manager.removeUserFromRoom(roomId, username);
            manager.printRooms();
        }
    }


    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        System.out.println("connected");

        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());
        String roomId = getHeaderValue(accessor, "room");
        String username = accessor.getUser().getName(); //created during handshake

        manager.addUserToRoom(roomId, username);
        manager.printRooms();
    }


    private String getHeaderValue(StompHeaderAccessor accessor, String value) {
        GenericMessage<?> generic = (GenericMessage<?>) accessor.getHeader(SimpMessageHeaderAccessor.CONNECT_MESSAGE_HEADER);
        if (nonNull(generic)) {
            SimpMessageHeaderAccessor nativeAccessor = SimpMessageHeaderAccessor.wrap(generic);
            List<String> userIdValue = nativeAccessor.getNativeHeader(value);

            return isNull(userIdValue) ? null : userIdValue.stream().findFirst().orElse(null);
        }

        return null;
    }
}
