import { CallbackList, WithCallbacks } from "MWL@2026/modules/Callbacks";
import { CALLBACKS } from "MWL@2026/modules/Callbacks/@contract/@types/WithCallbacks";

export type WithCapabilities<Args extends any[], T extends keyof CallbackList> = {
    readonly [CALLBACKS]: null|Pick<CallbackList<Args>, T>
}

export type Observable<Args extends any[] = []> = WithCallbacks<Args>;

export type SubscribableObservable<Args extends any[] = []>
    = WithCapabilities<Args, "add">;

export type QueryAbleObservable<Args extends any[] = []>
    = WithCapabilities<Args, "has"|"isEmpty">;

export type RemovableSubscribableObservable<Args extends any[] = []>
    = WithCapabilities<Args, "add"|"remove"|"has">;

export type TriggerableObservable<Args extends any[] = []>
    = WithCapabilities<Args, "trigger">;

export type ClearableObservable<Args extends any[] = []>
    = WithCapabilities<Args, "clear">;