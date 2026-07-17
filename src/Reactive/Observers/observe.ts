import { MAIN_EVENT, Observable } from "./EventSource";
import { Event } from "MWL@2026:Reactive/Event";
import CallbackRegistry, { Callback } from "../CallbackRegistry";

export function observeChanges<
                        T    extends object|null
                    >(
                        target: Observable<Event<T>>,
                        callback: NoInfer<Callback<T>>
                    ) {
    (target[MAIN_EVENT]as CallbackRegistry<T>).add(callback);
}

export function observe<
                        T    extends object|null
                    >(
                        target  : Observable<Event<T>>,
                        callback: NoInfer<Callback<T>>
                    ) {

    const registery = target[MAIN_EVENT]as CallbackRegistry<T>;
    registery.add(callback);

    // on the initial callback : no origin.
    const ctx = registery.getTriggerContext(null);

    callback.apply(ctx);
}

export function unobserve<
                        T    extends object|null,
                    >(
                        target  : Observable<Event<T>>,
                        callback: NoInfer<Callback<T>>
                    ) {
    (target[MAIN_EVENT]as CallbackRegistry<T>).remove(callback);
}