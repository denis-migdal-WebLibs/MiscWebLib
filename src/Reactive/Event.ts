import { PROXY_TARGET } from "./Properties/ValuesProxy";
import CallbackRegistry, { Callback, Event, TypeHint } from "./CallbackRegistry";

export function createEvent<
                                T    extends object|null,
                                ARGS extends any[] = []
                            >(
                                target: T,
                                args  : TypeHint<ARGS>|null = null
                            ): Event<T, ARGS> {

    return new CallbackRegistry(target, args);
}

type Observable<E extends Event<any,any>> = {readonly change: E};
type ProxyObservable<E extends Event<any,any>> = {readonly [PROXY_TARGET]: Observable<E>};

type EventSource<E extends Event<any,any>> = E
                                    | Observable<E>
                                    | ProxyObservable<E>
                                    | {readonly properties: ProxyObservable<E>};

function isEvent<E extends Event<any, any>>(e: E|unknown): e is E {
    return e instanceof CallbackRegistry
}

export function getCallbackRegistry<
                                T    extends object|null,
                                ARGS extends any[] = []
                            >(
                                target: EventSource<Event<T, ARGS>>
                            ): CallbackRegistry<T, ARGS> {

    if( "properties" in target)
        target = target.properties;

    if( PROXY_TARGET in target)
        target = target[PROXY_TARGET];

    if( ! isEvent<Event<T, ARGS>>(target) )
        target = target.change;

    return target as CallbackRegistry<T, ARGS>;
}

export function trigger<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target : EventSource<Event<T, ARGS>>,
                        origin : unknown = null,
                        ...args: ARGS
                    ) {

    const registry = getCallbackRegistry(target);
    registry.trigger(origin, ...args);
}

export function observeChanges<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target: EventSource<Event<T, ARGS>>,
                        callback: NoInfer<Callback<T, ARGS>>
                    ) {
    const registry = getCallbackRegistry(target);
    registry.add(callback);
}

export function observe<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target  : EventSource<Event<T, ARGS>>,
                        callback: NoInfer<Callback<T, ARGS>>,
                        ...args : NoInfer<ARGS>
                    ) {

    const registry = getCallbackRegistry(target);
    registry.add(callback);

    // on the initial callback : no origin.
    const ctx = registry.createTriggerContext(null);

    callback.apply(ctx, args);
}

export function unobserve<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target  : EventSource<Event<T, ARGS>>,
                        callback: NoInfer<Callback<T, ARGS>>
                    ) {

    const registry = getCallbackRegistry(target);
    registry.remove(callback);
}

//TODO move
function inPlaceRemove(target: any[], idx: number) {

    if( idx === -1 ) return;

    if(idx === target.length - 1) {
        --target.length;
        return;
    }

    target[idx] = target[target.length-1];
    --target.length;
}

// Register observer for easier cleanup.
export class ObserverRegistry {

    private readonly targets   = new Array<any>();
    private readonly callbacks = new Array<any>();

    observeChanges<
                        T    extends object|null = any,
                        ARGS extends any[] = []
                    >(
                        target: EventSource<Event<T, ARGS>>,
                        callback: Callback<T, ARGS>
                    ) {

        this.targets  .push(target  );
        this.callbacks.push(callback);

        observeChanges(target, callback);
    }
    
    clear() {
        for(let i = 0; i < this.targets.length ; ++i)
            unobserve(this.targets[i], this.callbacks[i]);

        this.targets  .length = 0;
        this.callbacks.length = 0;
    }

}

// Listen to several sources at once (with the same callback).
// Not appropriate when additional context is required.
export class Observer<
                        T    extends object|null = any,
                        ARGS extends any[] = []
                    > {

    readonly callback: Callback<T, ARGS>;

    readonly targets = new Array<EventSource<Event<T, ARGS>>>();

    constructor(callback: Callback<T, ARGS>) {
        this.callback = callback;
    }

    observe(target: EventSource<Event<T, ARGS>>, ...args: ARGS) {

        this.observeChanges(target);

        const registry = getCallbackRegistry(target);
        const ctx = registry.createTriggerContext(this);
        this.callback.apply(ctx, args);
    }

    observeChanges(target: EventSource<Event<T, ARGS>>) {
        this.targets.push(target);
        observeChanges(target, this.callback);
    }

    unobserve(target: EventSource<Event<T, ARGS>>) {
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

// => is this really useful ?
type FilterEvents<T extends Record<string, any>> = {
    [K in keyof T as T[K] extends Event<any, any> ? K : never]: T[K]
}

export function getEvents<T extends Record<string, any>>(target: T) {
    return target as FilterEvents<T>;
}

/*
class X {
    readonly change = createEvent(null);
    readonly events = getEvents(this);
}
*/