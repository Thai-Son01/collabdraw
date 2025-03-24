package com.thonking.collabdrawing;

public class CanvasDataRequest {
    private String image;
    private String requester;

    public CanvasDataRequest() {

    }
    public CanvasDataRequest(String image, String requester) {
        this.image = image;
        this.requester = requester;
    }

    public String getImage() {
        return image;
    }

    public String getRequester() {
        return requester;
    }
}
