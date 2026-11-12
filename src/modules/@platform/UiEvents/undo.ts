import {RichEvent} from "./core/RichEvent";

export const UNDO = new RichEvent("undo", "keydown", (ev: KeyboardEvent) => {
    return ev.ctrlKey && ev.key === "z";
});