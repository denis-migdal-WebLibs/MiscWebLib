import CallbackRegistry, { Callback } from "./CallbackRegistry";
import { MAIN_EVENT } from "./Observers/Observable";

export type Event<
            T extends object|null,
        > = {
    // we need a way to access internal methods.
    readonly [MAIN_EVENT]: CallbackRegistry<T>;
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