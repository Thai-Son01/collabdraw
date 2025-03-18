package com.thonking.collabdrawing;

class DrawingData {
    private Tool tool;
    private Point point;
    private PenStatus status;

    // Getters and Setters
    public Tool getTool() {
        return tool;
    }

    public void setTool(Tool tool) {
        this.tool = tool;
    }

    public Point getPoint() {
        return point;
    }

    public void setPoint(Point point) {
        this.point = point;
    }

    public PenStatus getStatus() {
        return status;
    }

    public void setStatus(PenStatus status) {
        this.status = status;
    }

    public String toString() {
        String x = String.valueOf(this.point.getX());
        String y = String.valueOf(this.point.getY());
        String status = String.valueOf(this.status);
        String tool = this.tool.toString();
        return "X : " + x + System.lineSeparator() +
                "Y : " + y + System.lineSeparator() +
                "Status : " + status + System.lineSeparator() +
                tool;
    }
}
