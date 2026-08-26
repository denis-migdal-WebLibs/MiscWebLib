import { defineWidget, Coordinator, View } from "MWL@2026/exports/Widget";
import { updateProperties } from "MWL@2026/exports/Reactive/PropertySystem";
import {on, UNDO, REDO, NEWLINE, TAB, connectEvents} from "MWL@2026/exports/browser/UiEvents";
import { deferredCallback } from "MWL@2026/exports/browser/scheduler";
import { listen } from "MWL@2026/exports/Reactive/Observable";

import { hl } from "../hl";
import { Input } from "./Input";
import { CodeEditorModel } from "./model";

const CodeEditor = defineWidget("code-editor",
        Coordinator(CodeEditorModel),
        View({
            content : __LOAD_FILE__("./index.html"),
            style   : [
                __LOAD_FILE__("./index.css"),
                __LOAD_FILE__("../Tomorrow.css"),
            ],
            elements: {
                output: HTMLElement
            },
            setup(controller) {

                const output = this.elements.output;
                const input  = new Input(output, (text: string) => {
                    return hl(text, controller.properties.lang);
                });

                // even if the text/pos didn't changed, we need to
                // re-render the text to properly highlight it.
                listen(controller, deferredCallback(this.renderer, () => {
                    input.text = controller.properties.text;
                    input.pos  = controller.properties.pos;
                    input.push();
                }))

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
        }) );

type CodeEditor = InstanceType<typeof CodeEditor>;

export {CodeEditor};