import {RichEvent} from "./core/RichEvent";

export const REDO = new RichEvent("redo", "keydown", (ev: KeyboardEvent) => {
    return ev.ctrlKey && (ev.key === "u" || ev.key === "Z");
});