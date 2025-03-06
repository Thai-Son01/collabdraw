export type changeValue  = (toolType : string, property : string, value : number | string) => void;

export interface tool {
    tool : string,
    width : number,
    opacity : number,
    colour? : Array<number>
}
