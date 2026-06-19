import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";
import { getCursorBegPos, getCursorEndPos, getCursorPos, hl, setCursorPos } from "../hl";
import UNDO from "@/DOM/UiEvents/undo";
import { connectEvents } from "@/DOM/UiEvents/core/connectEvent";
import REDO from "@/DOM/UiEvents/redo";
import NEWLINE from "@/DOM/UiEvents/newline";
import TAB from "@/DOM/UiEvents/tab";
import on from "@/DOM/UiEvents/core/on";
import StateHistory from "@/StateHistory";
import { observe } from "@/Reactive/Event";
import createPropertiesFactory from "@/Reactive/Properties/createPropertiesFactory";
import { Value } from "@/Reactive/Properties/PropertyTypes";
import { updateProperties } from "@/Reactive/Properties/PropertiesStore";

type InputState = {
    text: string,
    pos : number,
}

class Input implements InputState {

    readonly target: HTMLElement;
    text = "";
    pos  = 0;

    readonly format: (text: string) => string

    constructor(target: HTMLElement, format: (text: string) => string) {
        this.target = target;
        this.format = format;
    }

    insert(str: string) {
        this.pull();

        let beg = getCursorBegPos(this.target);
        let end = getCursorEndPos(this.target);

        if( beg === null) beg = this.text.length;
        if( end === null) end = beg;

        this.pos = beg + str.length;
        this.text = this.text.slice(0, beg) + str + this.text.slice(end);
    }

    pull() {
        let text = this.target.textContent;
        if( text.at(-1) === "\n")
            text = text.slice(0,-1);
        this.text = text;

        let cursor = getCursorPos(this.target);
        if( cursor === null)
            cursor = text.length;
        this.pos = cursor;
    }
    push() {
        this.target.innerHTML = this.format(this.text + "\n");
        
        setCursorPos(this.target, this.pos);
    }
}

const EditorProperties = createPropertiesFactory({
    lang: Value(null as null|string),
    text: Value(""),
    pos : Value(0),
});

const CodeEditor = defineWebComponent(

    class CodeEditor{

        readonly history    = new StateHistory<InputState>();
        readonly properties: ReturnType<typeof EditorProperties>;

        constructor(opts: {text?: string, lang?: string|null} = {}) {
        
            this.properties = EditorProperties(opts);

            observe(this.properties, () => {

                if( this.history.hasState) {
                    // do not push a state identical to the current one.
                    // also avoid possible re-entries.
                    const state = this.history.currentState;
                    if(    state.text === this.properties.text
                        && state.pos  === this.properties.pos
                    )
                        return;
                }

                this.history.push({
                    text: this.properties.text,
                    pos : this.properties.pos
                });
            }, null);
        }

        undo() {
            this.history.prev();
            updateProperties(this.properties, this.history.currentState);
        }
        redo() {
            this.history.next();
            updateProperties(this.properties, this.history.currentState);
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
        initialize: (ctx, controller, renderer) => {

            const output = ctx.elements.output;
            const input  = new Input(output, (text: string) => {
                return hl(text, controller.properties.lang);
            });

            renderer.add( () => {
                input.text = controller.properties.text;
                input.pos  = controller.properties.pos;
                input.push();
            });     

            function insert(char: string) {
                input.insert(char);
                commitState();
            }

            function commitState() {
                // atomic operation.
                updateProperties(controller.properties, {
                    text: input.text,
                    pos : input.pos
                })
            }

            observe(controller.properties, () => renderer.schedule(), null );

            connectEvents(output, [UNDO, REDO], controller);

            on(output, NEWLINE, () => insert("\n") );
            on(output, TAB    , () => insert("\t") );

            output.addEventListener("input", (ev) => {

                // for composing events, e.g. ^+e
                if( ev.isComposing ) return;

                input.pull();
                commitState();
            });

            //insert("a = 1 + 1;\nb = 2;\n");
        }
    }
)

export default CodeEditor;