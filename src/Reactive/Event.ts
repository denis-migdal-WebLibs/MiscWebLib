import CallbackRegistry, { Callback, TypeHint } from "./CallbackRegistry";

export type Event<
            T extends object|null,
            ARGS extends any[] = []
        > = {
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