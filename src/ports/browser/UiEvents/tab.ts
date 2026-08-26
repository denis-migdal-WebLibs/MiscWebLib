import {RichEvent} from "./core/RichEvent";

// doesn't work with keypress.
export const TAB = new RichEvent("tab", "keydown", (ev: KeyboardEvent) => {
    return ev.code === "Tab"
});