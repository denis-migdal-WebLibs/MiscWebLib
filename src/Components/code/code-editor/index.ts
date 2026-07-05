import defineWebComponent from "MWL@2026:DOM/WebComponent/defineWebComponent";
import { getCursorBegPos, getCursorEndPos, getCursorPos, hl, setCursorPos } from "../hl";
import UNDO from "MWL@2026:DOM/UiEvents/undo";
import { connectEvents } from "MWL@2026:DOM/UiEvents/core/connectEvent";
import REDO from "MWL@2026:DOM/UiEvents/redo";
import NEWLINE from "MWL@2026:DOM/UiEvents/newline";
import TAB from "MWL@2026:DOM/UiEvents/tab";
import on from "MWL@2026:DOM/UiEvents/core/on";
import StateHistory from "MWL@2026:StateHistory";
import deferredCallback from "MWL@2026:DOM/FrameScheduler/deferredCallback";
import { Value } from "MWL@2026:Reactive/Properties/Controllers";
import { updateProperties, WithProperties } from "MWL@2026:Reactive/Properties/createProperties";
import { GetPropertiesType } from "MWL@2026:Reactive/Properties/Property";
import { observe } from "MWL@2026:Reactive/Observers/observe";

type InputState = {
    text: string,
    pos : number|null,
}

class Input implements InputState {

    readonly target: HTMLElement;
    text = "";
    pos: number|null = null;

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
        
        let pos = this.pos;
        if( pos === null)
            pos = this.text.length;

        setCursorPos(this.target, pos);
    }
}

const EditorProperties = {
    lang: Value<string|null>(null),
    text: Value(""),
    pos : Value<number|null>(null),
};

const CodeEditor = defineWebComponent(

    class CodeEditor extends WithProperties(EditorProperties) {

        readonly history    = new StateHistory<InputState>();

        constructor(opts: Partial<GetPropertiesType<typeof EditorProperties>> = {}) {

            super(opts);

            observe(this, () => {

                const text = this.properties.text;
                const pos = this.properties.pos;

                if( this.history.hasState) {
                    // do not push a state identical to the current one.
                    // also avoid possible re-entries.
                    const state = this.history.currentState;
                    if( state.text === text  && state.pos  === pos)
                        return;
                }

                this.history.push({ text, pos });
            });
        }

        undo() {
            this.history.prev();
            updateProperties(this, this.history.currentState);
        }
        redo() {
            this.history.next();
            updateProperties(this, this.history.currentState);
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

            observe(controller,
                    deferredCallback(renderer, () => {
                        input.text = controller.properties.text;
                        input.pos  = controller.properties.pos;
                        input.push();
                    }));

            connectEvents(output, [UNDO, REDO], controller);

            on(output, NEWLINE, () => insert("\n") );
            on(output, TAB    , () => insert("\t") );

            output.addEventListener("input", (ev) => {

                // for composing events, e.g. ^+e
                if( ev.isComposing ) return;

                input.pull();
                commitState();
            });

            function insert(char: string) {
                input.insert(char);
                commitState();
            }

            function commitState() {
                // atomic operation.
                updateProperties(controller, {
                    text: input.text,
                    pos : input.pos
                })
            }
        }
    }
)

export default CodeEditor;