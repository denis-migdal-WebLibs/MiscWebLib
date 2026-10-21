import {RichEvent} from "./core/RichEvent";

export const NEWLINE = new RichEvent("newline", "keypress", (ev: KeyboardEvent) => {
    return ev.code === "Enter";
});