import { CallbackList } from "./CallbackList";

export const CALLBACKS = Symbol();
export type  CALLBACKS = typeof CALLBACKS;

export type WithCallbacks<CallbackArgs extends any[] = []> = {
    readonly [CALLBACKS]: CallbackList<CallbackArgs>|null
}

export function getCallbacks<CallbackArgs extends any[] = []>(target: WithCallbacks<CallbackArgs>): CallbackList<CallbackArgs>|null {
        return target[CALLBACKS];
}

export function setCallbacks<CallbackArgs extends any[] = []>(target: WithCallbacks<CallbackArgs>, callbacks: CallbackList<CallbackArgs>|null) {
    // @ts-expect-error
    target[CALLBACKS] = callbacks;
}