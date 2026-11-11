import { WithCallbacks } from "./WithCallbacks";

export type Callback<Args extends any[] = []> = (...args: Args) => void;

export interface CallbackList<CallbackArgs extends any[] = []>
            extends WithCallbacks<CallbackArgs> {

    trigger(...args: CallbackArgs): void;

    has   (callback: Callback<CallbackArgs>): boolean;
    add   (callback: Callback<CallbackArgs>): void;
    remove(callback: Callback<CallbackArgs>): void;

    clear(): void;
    readonly isEmpty: boolean;
}