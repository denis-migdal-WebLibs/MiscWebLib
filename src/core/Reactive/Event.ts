import CallbackRegistry, { Callback, MAIN_EVENT } from "./CallbackRegistry";

export type Event<
            T extends object|null,
        > = {
    [MAIN_EVENT]: CallbackRegistry<T>;
    addListener   (callback: Callback<T>): void;
    removeListener(callback: Callback<T>): void;
}

export function createEvent<
                                T extends object|null,
                            >(
                                target: T
                            ): Event<T> {

    return new CallbackRegistry(target);
}