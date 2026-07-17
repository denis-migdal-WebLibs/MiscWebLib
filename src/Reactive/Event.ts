import CallbackRegistry, { Callback } from "./CallbackRegistry";
import { MAIN_EVENT } from "./Observers/EventSource";

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