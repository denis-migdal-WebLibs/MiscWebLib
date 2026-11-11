import { Callback } from "MWL@2026/modules/Callbacks";
import { ClearableObservable, Observable, QueryAbleObservable, RemovableSubscribableObservable, SubscribableObservable, TriggerableObservable } from "./@types";

export interface ObservableDetails {

    Observable: new() => Observable;

    /** `listen(target, callback): void` */
    listen<CallbackArgs extends any[]=[]>(
                target  : SubscribableObservable<CallbackArgs>,
                callback: Callback<NoInfer<CallbackArgs>>
            ) : void;

    /** `observe(target, callback): void` */
    observe(
                    target  : SubscribableObservable<[]>,
                    callback: Callback<NoInfer<[]>>
                ): void;
    /** `unlisten(target, callback): void` */
    unlisten<CallbackArgs extends any[] = []>(
                target  : RemovableSubscribableObservable<CallbackArgs>,
                callback: Callback<NoInfer<CallbackArgs>>
            ): void;
    /** `unobserve(target, callback): void` */
    unobserve<
                CallbackArgs extends any[] = []
            >(
                target  : RemovableSubscribableObservable<CallbackArgs>,
                callback: Callback<NoInfer<CallbackArgs>>
            ): void;
    /** `isListening(target, callback): void` */
    isListening<CallbackArgs extends any[] = []>(
                target  : QueryAbleObservable<CallbackArgs>,
                callback: Callback<NoInfer<CallbackArgs>>
            ): boolean;
    /** `trigger(target, ...args): void` */
    trigger<CallbackArgs extends any[] = []>(
                    target: TriggerableObservable<CallbackArgs>,
                    ...args: NoInfer<CallbackArgs>
                ): void;
    /** `triggerDrain(target, ...args): void`
     * 
     * Trigger the target, then clear it.
    */
    triggerDrain<CallbackArgs extends any[] = []>(
                    target: TriggerableObservable<CallbackArgs>
                            & ClearableObservable,
                    ...args: NoInfer<CallbackArgs>
                ): void;
    /** `canSkipTrigger(target): boolean`
     * 
     * The target isn't currently listened, therefore we can skip the trigger process.
     */
    canSkipTrigger<CallbackArgs extends any[] = []>(
                    target: QueryAbleObservable<CallbackArgs>
                ): boolean;
    /** `clear(target): void` */
    clear(target: ClearableObservable): void;
}

export interface ObservableContract extends ObservableDetails {}