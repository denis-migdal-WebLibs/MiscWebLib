import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";
import { hl } from "../hl";
import UNDO from "@/DOM/UiEvents/undo";
import { connectEvents } from "@/DOM/UiEvents/core/connectEvent";
import REDO from "@/DOM/UiEvents/redo";

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

            const text = "a = 1 + 1;\nb = 2;\n";

            const output = ctx.elements.output;

            // we need to add a \n for the last line.
            output.innerHTML = hl(text + "\n", "ts");

            //TODO: what if deleted => ignore...
            console.warn( output.textContent.slice(0,-1) ); // remove the last "\n".

            connectEvents(output, [UNDO, REDO], controller);
        }
    }
)