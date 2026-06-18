import { NULL_OP } from "@/types";

export type Callback<
                T extends object|null,
                ARGS extends any[] = []
            > = (this: CallbackRegistry<T, ARGS>, ...args: ARGS) => void;

export type Event<
            T extends object|null,
            ARGS extends any[] = []
        > = {
    addListener(callback: Callback<T, ARGS>): void;
    removeListener(callback: Callback<T, ARGS>): void;
}

//TODO: move...
const TypeHint = Symbol();
export type TypeHint<T> = {
    [TypeHint]: T
};

export function typeHint<T>(): TypeHint<T> {
    return null as any as TypeHint<T>; // fake value...
}

export default class CallbackRegistry<
                                T extends object|null,
                                ARGS extends any[] = []
                            > {

    private readonly callbacks = new Array<Callback<T, ARGS>>();
    private readonly clearAfterTrigger: boolean;

    readonly target: T;

    constructor(
                    target: T,
                    _args : TypeHint<ARGS>|null = null,
                    clearAfterTrigger = false
                ) {
        this.clearAfterTrigger = clearAfterTrigger;
        this.target = target;
    }

    trigger(...args: ARGS) {

        // need to compact to avoid growing callback list.
        if( ! this.clearAfterTrigger )
            this.compactCallbacks();

        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i].apply(this, args);

        if( this.clearAfterTrigger )
            this.clear();
    }

    add(callback: Callback<T, ARGS>) {
        this.callbacks.push(callback);
    }

    remove(callback: Callback<T, ARGS>): void {

        const idx = this.callbacks.indexOf(callback);
        if( idx === -1)
            return;

        this.callbacks[idx] = NULL_OP;
        this.removalPending = true;
    }

    // aliases for Event.
    addListener(callback: Callback<T, ARGS>) {
        return this.add(callback);
    }
    removeListener(callback: Callback<T, ARGS>) {
        return this.remove(callback);
    }

    private removalPending = false;

    // do NOT call it during a trigger.
    clear() {
        this.callbacks.length = 0;
        this.removalPending = false;
    }

    compactCallbacks() {

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

// new CallbackRegistry(null, typeHint<[number, string]>())