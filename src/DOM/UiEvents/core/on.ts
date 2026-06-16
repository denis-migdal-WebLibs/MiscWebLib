import RichEvent from "./RichEvent";

export default function on(target: EventTarget, ev: RichEvent<string, any>, callback: () => void) {
    ev.attach(target, callback);
}