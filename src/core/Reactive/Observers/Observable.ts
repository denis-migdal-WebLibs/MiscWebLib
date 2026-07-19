import CallbackRegistry, { MAIN_EVENT } from "../CallbackRegistry";
import {Event} from "../Event";

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