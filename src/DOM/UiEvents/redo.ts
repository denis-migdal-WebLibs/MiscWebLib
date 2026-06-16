import RichEvent from "./core/RichEvent";

const REDO = new RichEvent("undo", "keydown", (ev: KeyboardEvent) => {
    return ev.ctrlKey && (ev.key === "u" || ev.key === "Z");
});

export default REDO;