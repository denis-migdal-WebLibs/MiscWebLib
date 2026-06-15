import { NULL_OP } from "./types";

type Callback<ARGS extends any[] = []> = (...args: ARGS) => void;

export default class CallbackRegistry<ARGS extends any[] = []> {

    private readonly callbacks = new Array<Callback<ARGS>>();

    trigger(...args: ARGS) {
        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i](...args);
    }

    add(callback: Callback<ARGS>) {
        this.callbacks.push(callback);
    }


    remove(callback: Callback<ARGS>): void {

        const idx = this.callbacks.indexOf(callback);
        if( idx === -1)
            return;

        this.callbacks[idx] = NULL_OP;
        this.removalPending = true;
    }

    private removalPending = false;

    // do NOT call it during a trigger.
    clear() {
        this.callbacks.length = 0;
        this.removalPending = false;
    }

    compactListeners() {

        if( ! this.removalPending ) // compact only if necessary.
            return;

        let offset = 0;
        for(let i = 0; i < this.callbacks.length; ++i) {
            if( this.callbacks[i] !== NULL_OP)
                this.callbacks[offset++] = this.callbacks[i];
        }

        this.callbacks.length = offset;
        this.removalPending = false;
    }
}