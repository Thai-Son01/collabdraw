package com.thonking.collabdrawing;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class GreetingController {

    @Autowired private SimpUserRegistry userRegistry;

    @MessageMapping("/hello")
    @SendTo("/topic/greetings")
    public Greeting greeting(HelloMessage message) throws Exception {
//        System.out.println(message.getName());
        Thread.sleep(1000); // simulated delay
        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
    }

}

//@Controller
//public class GreetingController {
//
//    @MessageMapping(value = "/hello") //si on send a ca
//    @SendTo("/topic/greetings") // ca va etre retourner a ceux qui sont subscribed a ca
//    public Greeting greeting(HelloMessage message) throws Exception {
//        System.out.println("we got a catch boys");
//        Thread.sleep(1000);
//        return new Greeting("Hello, " + HtmlUtils.htmlEscape(message.getName()) + "!");
//    }
//}
