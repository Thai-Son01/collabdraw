export enum PenStatus {
    START,
    MOVING,
    LIFTED,
}

export type changeValue  = (toolType : string, property : string, value : number | string) => void;

export interface tool {
    tool : string,
    width : number,
    opacity? : number,
    colour? : Array<number>
}

export interface drawData {
    tool : tool,
    point : point,
    status : PenStatus

}

export interface point {
    x: number,
    y: number
}