import RichEvent from "./core/RichEvent";

const NEWLINE = new RichEvent("newline", "keypress", (ev: KeyboardEvent) => {
    return ev.code === "Enter";
});

export default NEWLINE;