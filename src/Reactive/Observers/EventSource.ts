import CallbackRegistry from "../CallbackRegistry";
import type { Event } from "../Event";

export const MAIN_EVENT: unique symbol = Symbol();

export type Observable<E extends Event<any,any>> = E
                                                | {readonly [MAIN_EVENT]: E};

export function trigger<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target : Observable<Event<T, ARGS>>,
                        origin : unknown = null,
                        ...args: ARGS
                    ) {
    (target[MAIN_EVENT] as CallbackRegistry<T, ARGS>).trigger(origin, ...args);
}