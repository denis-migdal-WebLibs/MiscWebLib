import { Cstr } from "MWL@2026:exports/types";
import CallbackRegistry from "../CallbackRegistry";
import {createEvent, Event} from "../Event";

export const MAIN_EVENT: unique symbol = Symbol();

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

export class ObservableObject {
    readonly [MAIN_EVENT] = createEvent(this);
}

export function ObservableMixin<K extends Cstr<object, any[]>>(klass: K) {
    return class ObservableMixin extends klass {
        readonly [MAIN_EVENT] = createEvent(this);
    }
}