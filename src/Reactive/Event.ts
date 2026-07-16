import CallbackRegistry, { Callback, TypeHint } from "./CallbackRegistry";
import { MAIN_EVENT } from "./Observers/EventSource";

export type Event<
            T extends object|null,
            ARGS extends any[] = []
        > = {
    [MAIN_EVENT]: CallbackRegistry<T, ARGS>;
    addListener   (callback: Callback<T, ARGS>): void;
    removeListener(callback: Callback<T, ARGS>): void;
}

export function createEvent<
                                T    extends object|null,
                                ARGS extends any[] = []
                            >(
                                target: T,
                                args  : TypeHint<ARGS>|null = null
                            ): Event<T, ARGS> {

    return new CallbackRegistry(target, args);
}