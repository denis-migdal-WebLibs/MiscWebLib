import { NULL_OP } from "./types";

/**
 * createEvent<T, ARGS>(target: T)
 * OU createEventFactory<ARGS>()<T>(target: T).
 * trigger(event, ...args)
 */

//TODO: use CallbackRegistry

export type Listener<T, ARGS extends any[] = []>
                        = (event: REvent<T, ARGS>, ...args: ARGS) => void;

export interface REvent<T, ARGS extends any[] = []> {

    readonly target: T;

    addListener   (listener: Listener<T, ARGS>): void;
    removeListener(listener: Listener<T, ARGS>): void;
}

export interface WEvent<_T, ARGS extends any[] = []> {
    trigger(...args: ARGS): void
}

export default class Event<T, ARGS extends any[] = []>
            implements REvent<T, ARGS>, WEvent<T, ARGS> {

    protected listeners = new Array<Listener<T, ARGS>>();
    readonly target: T;

    constructor(target: T) {
        this.target = target;
    }

    trigger(...args: ARGS) {

        this.compactListeners();

        for(let i = 0; i < this.listeners.length; ++i)
            this.listeners[i](this, ...args);
    }

    addListener(listener: Listener<T, ARGS>) {
        this.listeners.push(listener);
    }

    removeListener(listener: Listener<T, ARGS>): void {

        const idx = this.listeners.indexOf(listener);
        if( idx === -1)
            return;

        this.listeners[idx] = NULL_OP;
        this.removalPending = true;
    }

    protected removalPending: boolean = false;
    protected compactListeners() {

        if( ! this.removalPending ) // compact if necessary.
            return;

        let offset = 0;
        for(let i = 0; i < this.listeners.length; ++i) {
            if( this.listeners[i] !== NULL_OP)
                this.listeners[offset++] = this.listeners[i];
        }

        this.listeners.length = offset;
        this.removalPending = false;
    }
}

type GetArgs<T extends REvent<any, any>> = T extends REvent<any, infer U>
                                            ? U
                                            : [];

export function createEvent<T = null, ARGS extends any[] = []>(target: T = null as T): REvent<T, ARGS> {
    return new Event(target);
}

export function createEventFactory<ARGS extends any[]>() {
    return createEvent as <T = null>(target?: T) => REvent<T, ARGS>;
}

export function trigger<EVENT extends REvent<any, any>>(
                        event: EVENT,
                        ...args: NoInfer<GetArgs<EVENT>>
                    ) {
    asRW(event).trigger(...args as any);
}


export function createEvents<T, N extends string>(target: T, ...names: N[]
    ): Record<N, REvent<T>> {

    const result: Record<string, Event<T>> = {};

    for(let i = 0; i < names.length; ++i)
        result[names[i]] = new Event(target);

    return result as Record<N, Event<T>>;
}

import "./types/asRW"
import asRW from "./types/asRW";
declare module "./types/asRW" {
    export interface TasRW {
        <T, ARGS extends any[]>(ro: REvent<T, ARGS>): REvent<T, ARGS>&WEvent<T, ARGS>
    }
}