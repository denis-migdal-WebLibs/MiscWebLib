import StateHistory from "./StateHistory";
import { observe } from "MWL@2026/@exports/Observable";
import { updateProperties, WithProperties } from "MWL@2026/@exports/Reactive/PropertySystem";
import { Value } from "MWL@2026/@exports/Reactive/PropertySystem/controllers";

export type InputState = {
    text: string,
    pos : number|null,
};

//TODO: use Model()
const Base = WithProperties({
                                lang: Value<string|null>(null),
                                text: Value(""),
                                pos : Value<number|null>(null),
                            });

export class CodeEditor extends Base {

    readonly history    = new StateHistory<InputState>();

    constructor(...args: ConstructorParameters<typeof Base>) {
        super(...args);

        observe(this, () => {

            const text = this.properties.text;
            const pos  = this.properties.pos;

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
        updateProperties<CodeEditor>(this, this.history.currentState);
    }
    redo() {
        this.history.next();
        updateProperties<CodeEditor>(this, this.history.currentState);
    }
}