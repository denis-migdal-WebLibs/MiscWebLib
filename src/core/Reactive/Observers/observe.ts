import { Observable } from "./Observable";
import CallbackRegistry, { Callback } from "../CallbackRegistry";
import { MAIN_EVENT } from "./MAIN_EVENT";

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

    (target[MAIN_EVENT] as CallbackRegistry<T>).add(callback);

    // on the initial callback : no origin.
    triggerCallback(target, callback, null);
}

export function triggerCallback<T extends object|null> (
                        target  : Observable<T>,
                        callback: NoInfer<Callback<T>>,
                        origin  : unknown
                    ) {

        const ctx = (target[MAIN_EVENT]as CallbackRegistry<T>).getTriggerContext(origin);
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