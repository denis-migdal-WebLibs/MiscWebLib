import CallbackRegistry, { MAIN_EVENT } from "../CallbackRegistry";
import {Event} from "../Event";

export type Observable<
                            T extends object|null
                        > = {readonly [MAIN_EVENT]: Event<T>};

export function trigger<
                        T    extends object|null
                    >(
                        target : Observable<T>,
                        origin : unknown = null,
                    ) {
    (target[MAIN_EVENT] as CallbackRegistry<T>).trigger(origin);
}