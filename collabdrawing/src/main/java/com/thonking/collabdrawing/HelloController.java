package com.thonking.collabdrawing;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

import java.util.AbstractMap;


@Controller
public class HelloController {

    //might not need this
    @MessageMapping("/connect/{roomId}")
    public void onConnect(@DestinationVariable String roomId, HelloMessage message, SimpMessageHeaderAccessor accessor){

        AbstractMap.SimpleEntry<String, String> userInfo;
        userInfo = new AbstractMap.SimpleEntry<>(message.getName(), roomId);
        accessor.getSessionAttributes().put("userInfo", userInfo);

    }
}
