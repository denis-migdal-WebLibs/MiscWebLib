import { MAIN_EVENT, Observable } from "./EventSource";
import { Event } from "MWL@2026:Reactive/Event";
import CallbackRegistry, { Callback } from "../CallbackRegistry";

export function observeChanges<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target: Observable<Event<T, ARGS>>,
                        callback: NoInfer<Callback<T, ARGS>>
                    ) {
    (target[MAIN_EVENT]as CallbackRegistry<T, ARGS>).add(callback);
}

export function observe<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target  : Observable<Event<T, ARGS>>,
                        callback: NoInfer<Callback<T, ARGS>>,
                        ...args : NoInfer<ARGS>
                    ) {

    const registery = target[MAIN_EVENT]as CallbackRegistry<T, ARGS>;
    registery.add(callback);

    // on the initial callback : no origin.
    const ctx = registery.createTriggerContext(null);

    callback.apply(ctx, args);
}

export function unobserve<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target  : Observable<Event<T, ARGS>>,
                        callback: NoInfer<Callback<T, ARGS>>
                    ) {
    (target[MAIN_EVENT]as CallbackRegistry<T, ARGS>).remove(callback);
}