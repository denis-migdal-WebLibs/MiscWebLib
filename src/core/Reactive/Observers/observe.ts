import { Observable } from "./Observable";
import CallbackRegistry, { Callback, MAIN_EVENT } from "../CallbackRegistry";

export function listen<
                        T    extends object|null
                    >(
                        target: Observable<T>,
                        callback: NoInfer<Callback<T>>
                    ) {
    (target[MAIN_EVENT]as CallbackRegistry<T>).add(callback);
}

export function observe<
                        T    extends object|null
                    >(
                        target  : Observable<T>,
                        callback: NoInfer<Callback<T>>
                    ) {

    const registery = target[MAIN_EVENT]as CallbackRegistry<T>;
    registery.add(callback);

    // on the initial callback : no origin.
    const ctx = registery.getTriggerContext(null);

    callback.apply(ctx);
}

export function unlisten<
                        T    extends object|null,
                    >(
                        target  : Observable<T>,
                        callback: NoInfer<Callback<T>>
                    ) {
    (target[MAIN_EVENT]as CallbackRegistry<T>).remove(callback);
}

export const unobserve = unlisten;