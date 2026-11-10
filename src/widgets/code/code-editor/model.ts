import StateHistory from "./StateHistory";
import { Properties } from "MWL@2026/modules/Collections/Properties";
import { Value, updateProperties } from "MWL@2026/modules/Reactive/Property/";
import { observe } from "MWL@2026/modules/Observable";

export type InputState = {
    text: string,
    pos : number|null,
};

//TODO: use Model()
const Base = Properties({
                                lang: Value<string|null>(null),
                                text: Value(""),
                                pos : Value<number|null>(null),
                            });

export class CodeEditor extends Base {

    readonly history    = new StateHistory<InputState>();

    constructor(...args: ConstructorParameters<typeof Base>) {
        super(...args);

        observe(this, () => {

            const text = this.text;
            const pos  = this.pos;

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
}