package com.thonking.collabdrawing;

import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class RoomManager {
    private static final Map<String, LinkedHashSet<String>> rooms = new HashMap<>();

    public void addUserToRoom(String roomId, String username) {

        if (rooms.containsKey(roomId)) {
            rooms.get(roomId).add(username);
        }

        else {
            LinkedHashSet<String> names = new LinkedHashSet<>();
            names.add(username);
            rooms.put(roomId, names);
        }
    }

    public void removeUserFromRoom(String roomId, String username) {

        if (rooms.containsKey(roomId)) {
            rooms.get(roomId).remove(username);

            if (rooms.get(roomId).isEmpty()) {
                rooms.remove(roomId);
            }
        }
    }

    public Set<String> getRoomUsers(String roomId) {

        if (rooms.containsKey(roomId)) {
            return rooms.get(roomId);
        }
        return null;
    }

    public String getRoomIdFromUser(String user) {
        for (Map.Entry<String, LinkedHashSet<String>> entry : rooms.entrySet()) {
            if (entry.getValue().contains(user)) {
                return entry.getKey();
            }
        }
        return null;
    }

    public void printRooms() {

        for (Map.Entry<String, LinkedHashSet<String>> entry : rooms.entrySet()) {
            String key = entry.getKey();
            Set<String> value = entry.getValue();
            System.out.println("ROOM : " + key);
            System.out.println("USERS IN ROOM" + value);
        }

        if (rooms.isEmpty()) {
            System.out.println("NO ROOMS CURRENTLY");
        }
    }
}
