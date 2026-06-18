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

//TODO: and proxy...
type EventSource<E extends Event<any,any>> = E
                                    | {readonly change: E};

function isEvent<E extends Event<any, any>>(e: E|unknown): e is E {
    return e instanceof CallbackRegistry
}

export function getCallbackRegistry<
                                T    extends object|null,
                                ARGS extends any[] = []
                            >(
                                target: EventSource<Event<T, ARGS>>
                            ): CallbackRegistry<T, ARGS> {

    if( ! isEvent<Event<T, ARGS>>(target) )
        target = target.change;

    return target as CallbackRegistry<T, ARGS>;
}

export function trigger<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target : EventSource<Event<T, ARGS>>,
                        ...args: ARGS
                    ) {

    const registry = getCallbackRegistry(target);
    registry.trigger(...args);
}

export function observeChanges<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target: EventSource<Event<T, ARGS>>,
                        callback: Callback<T, ARGS>
                    ) {
    const registry = getCallbackRegistry(target);
    registry.add(callback);
}

export function observe<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target  : EventSource<Event<T, ARGS>>,
                        callback: Callback<T, ARGS>,
                        ...args : ARGS
                    ) {

    const registry = getCallbackRegistry(target);
    registry.add(callback);

    callback.apply(registry, args);
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