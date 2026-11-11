import { CallbackList } from "./CallbackList";

export const CALLBACKS = Symbol();
export type  CALLBACKS = typeof CALLBACKS;

export type WithCallbacks<CallbackArgs extends any[] = []> = {
    readonly [CALLBACKS]: CallbackList<CallbackArgs>
}

export function getCallbacks<CallbackArgs extends any[] = []>(target: WithCallbacks<CallbackArgs>): CallbackList<CallbackArgs> {
        return target[CALLBACKS];
}