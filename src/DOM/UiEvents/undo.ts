import RichEvent from "./core/RichEvent";

const UNDO = new RichEvent("undo", "keydown", (ev: KeyboardEvent) => {
    return ev.ctrlKey && ev.key === "z";
});

export default UNDO;