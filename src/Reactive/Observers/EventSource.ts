import CallbackRegistry from "../CallbackRegistry";
import type { Event } from "../Event";

export const MAIN_EVENT: unique symbol = Symbol();

export type Observable<E extends Event<any>> = E
                                            | {readonly [MAIN_EVENT]: E};

export function trigger<
                        T    extends object|null
                    >(
                        target : Observable<Event<T>>,
                        origin : unknown = null,
                    ) {
    (target[MAIN_EVENT] as CallbackRegistry<T>).trigger(origin);
}