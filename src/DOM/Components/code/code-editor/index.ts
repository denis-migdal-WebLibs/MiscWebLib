import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";
import { getCursorBegPos, getCursorEndPos, getCursorPos, hl, setCursorPos } from "../hl";
import UNDO from "@/DOM/UiEvents/undo";
import { connectEvents } from "@/DOM/UiEvents/core/connectEvent";
import REDO from "@/DOM/UiEvents/redo";
import NEWLINE from "@/DOM/UiEvents/newline";
import TAB from "@/DOM/UiEvents/tab";
import on from "@/DOM/UiEvents/core/on";

/*
getCursorPos, setCursorPos
*/

defineWebComponent(
    class CodeEditor{
        undo() {
            console.warn("undo");
        }
    },
    {
        name: "code-editor",
        content : __LOAD_FILE__("./index.html"),
        style   : [
            __LOAD_FILE__("./index.css"),
            __LOAD_FILE__("../Tomorrow.css"),
        ],
        elements: {
            output: HTMLElement
        },
        initialize: (ctx, controller) => {

            const output = ctx.elements.output;

            //TODO: move outside...
            function insert(char: string) {
                let text = read();

                const beg = getCursorBegPos(output);
                const end = getCursorEndPos(output);

                if( beg === null || end === null)
                    throw new Error("?");

                text = text.slice(0, beg) + char + text.slice(end);

                commit(text, beg + char.length);
            }

            function commit(text: string, pos: number) {
                //TODO: add historique.
                write(text, "ts", pos);
            }

            // we need to add an extra \n for the last line.
            function write(text: string, lang: string, pos: number) {
                output.innerHTML = hl(text + "\n", lang);
                setCursorPos(output, pos);
            }

            function read() {
                let text = output.textContent;
                if( text.at(-1) === "\n")
                    text = text.slice(0,-1);
                return text;
            }

            commit("a = 1 + 1;\nb = 2;\n", 5);

            connectEvents(output, [UNDO, REDO], controller);

            on(output, NEWLINE, () => insert("\n") );
            on(output, TAB    , () => insert("[\t]") );

            output.addEventListener("input", (ev) => {

                // for composing events, e.g. ^+e
                if( ev.isComposing ) return;

                const cursor = getCursorPos(output);
                if( cursor === null)
                    throw new Error("?");

                commit( read(), cursor);
            });
        }
    }
)