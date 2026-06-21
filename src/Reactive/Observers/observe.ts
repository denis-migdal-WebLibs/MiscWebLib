import { getCallbackRegistry, Observable } from "./EventSource";
import { Callback } from "../CallbackRegistry";
import type { Event } from "../Event";

export function observeChanges<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target: Observable<Event<T, ARGS>>,
                        callback: NoInfer<Callback<T, ARGS>>
                    ) {
    const registry = getCallbackRegistry(target);
    registry.add(callback);
}

export function observe<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target  : Observable<Event<T, ARGS>>,
                        callback: NoInfer<Callback<T, ARGS>>,
                        ...args : NoInfer<ARGS>
                    ) {

    const registry = getCallbackRegistry(target);
    registry.add(callback);

    // on the initial callback : no origin.
    const ctx = registry.createTriggerContext(null);

    callback.apply(ctx, args);
}

export function unobserve<
                        T    extends object|null,
                        ARGS extends any[] = []
                    >(
                        target  : Observable<Event<T, ARGS>>,
                        callback: NoInfer<Callback<T, ARGS>>
                    ) {

    const registry = getCallbackRegistry(target);
    registry.remove(callback);
}