import {RichEvent} from "./RichEvent";

export function on(target: EventTarget, ev: RichEvent<string, any>, callback: () => void) {
    ev.attach(target, callback);
}