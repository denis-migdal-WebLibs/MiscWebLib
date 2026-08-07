import { getCursorBegPos, getCursorEndPos, getCursorPos, setCursorPos } from "../hl";
import { InputState } from "./model";

export class Input implements InputState {

    readonly target: HTMLElement;
    text = "";
    pos: number|null = null;

    readonly format: (text: string) => string

    constructor(target: HTMLElement, format: (text: string) => string) {
        this.target = target;
        this.format = format;
    }

    insert(str: string) {
        this.pull();

        let beg = getCursorBegPos(this.target);
        let end = getCursorEndPos(this.target);

        if( beg === null) beg = this.text.length;
        if( end === null) end = beg;

        this.pos = beg + str.length;
        this.text = this.text.slice(0, beg) + str + this.text.slice(end);
    }

    pull() {
        let text = this.target.textContent;
        if( text.at(-1) === "\n")
            text = text.slice(0,-1);
        this.text = text;

        let cursor = getCursorPos(this.target);
        if( cursor === null)
            cursor = text.length;
        this.pos = cursor;
    }
    push() {
        this.target.innerHTML = this.format(this.text + "\n");
        
        let pos = this.pos;
        if( pos === null)
            pos = this.text.length;

        setCursorPos(this.target, pos);
    }
}