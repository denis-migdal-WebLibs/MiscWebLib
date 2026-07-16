import CallbackRegistry, { Callback } from "../CallbackRegistry";
import type { Event } from "../Event";
import { MAIN_EVENT, Observable } from "./EventSource";
import { observeChanges, unobserve } from "./observe";

//TODO move ?
function inPlaceRemove(target: any[], idx: number) {

    if( idx === -1 ) return;

    if(idx === target.length - 1) {
        --target.length;
        return;
    }

    target[idx] = target[target.length-1];
    --target.length;
}

// Listen to several sources at once (with the same callback).
// Not appropriate when additional context is required.
export class Observer<
                        T    extends object|null = any,
                        ARGS extends any[] = []
                    > {

    readonly callback: Callback<T, ARGS>;

    readonly targets = new Array<Observable<Event<T, ARGS>>>();

    constructor(callback: Callback<T, ARGS>) {
        this.callback = callback;
    }

    observe(target: Observable<Event<T, ARGS>>, ...args: ARGS) {

        this.observeChanges(target);

        const ctx = (target[MAIN_EVENT]as CallbackRegistry<T, ARGS>).createTriggerContext(this);
        this.callback.apply(ctx, args);
    }

    observeChanges(target: Observable<Event<T, ARGS>>) {
        this.targets.push(target);
        observeChanges(target, this.callback);
    }

    unobserve(target: Observable<Event<T, ARGS>>) {
        const idx = this.targets.lastIndexOf(target);
        if( idx === -1 )
            return;

        // we don't care about order.
        inPlaceRemove(this.targets, idx);

        unobserve(target, this.callback);
    }

    clear() {
        for(let i = 0; i < this.targets.length; ++i)
            unobserve(this.targets[i], this.callback);

        this.targets.length = 0
    }
}