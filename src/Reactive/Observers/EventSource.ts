import CallbackRegistry from "../CallbackRegistry";
import type { Event } from "../Event";

export const MAIN_EVENT = Symbol();

export type Observable<E extends Event<any,any>> = E
                                                | {readonly [MAIN_EVENT]: E};


export function getCallbackRegistry<
                                T    extends object|null,
                                ARGS extends any[] = []
                            >(
                                target: Observable<Event<T, ARGS>>
                            ): CallbackRegistry<T, ARGS> {

    if( MAIN_EVENT in target)
        target = target[MAIN_EVENT];

    // Event should be a CallbackRegistry.
    return target as CallbackRegistry<T, ARGS>;
}

export function trigger<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target : Observable<Event<T, ARGS>>,
                        origin : unknown = null,
                        ...args: ARGS
                    ) {

    const registry = getCallbackRegistry(target);
    registry.trigger(origin, ...args);
}