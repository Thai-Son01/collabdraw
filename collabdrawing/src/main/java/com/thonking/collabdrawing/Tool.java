package com.thonking.collabdrawing;
import java.util.List;

class Tool {
    private String tool;
    private double width;
    private Double opacity;
    private List<Integer> colour;

    // Getters and Setters
    public String getTool() {
        return tool;
    }

    public void setTool(String tool) {
        this.tool = tool;
    }

    public double getWidth() {
        return width;
    }

    public void setWidth(double width) {
        this.width = width;
    }

    public Double getOpacity() {
        return opacity;
    }

    public void setOpacity(Double opacity) {
        this.opacity = opacity;
    }

    public List<Integer> getColour() {
        return colour;
    }

    public void setColour(List<Integer> colour) {
        this.colour = colour;
    }

    public String toString() {
        String w = String.valueOf(this.width);
        String o = String.valueOf(this.opacity);
        String c = this.colour.toString();

        return "Colour : " + c + System.lineSeparator() + "Opacity : " + o + System.lineSeparator() + "Width : " + w + System.lineSeparator();

    }
}