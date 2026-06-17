import RichEvent from "./core/RichEvent";

// doesn't work with keypress.
const TAB = new RichEvent("tab", "keydown", (ev: KeyboardEvent) => {
    return ev.code === "Tab"
});

export default TAB;