import { DefineExtensionsFcts } from "MWL@2026/@types/Extensions";
import { Callback, ClearableObservable, Hook, HookFactory, ObservableObjectClass, ObservationControllerClass, SubscribableObservable, TriggerableObservable } from "./@types/def";

export interface ObservableServices {

    /** `listen(target, callback): void` */
    listen<
                CallbackCtx  extends object|void = void,
                CallbackArgs extends any[]=[]
            >(
                target  : SubscribableObservable<CallbackCtx, CallbackArgs>,
                callback: NoInfer<Callback<CallbackCtx, CallbackArgs>>
            ) : void;
    /** `observe(target, callback): void` */
    observe<CallbackCtx extends object|void = void>(
                    target  : SubscribableObservable<CallbackCtx, []>,
                    callback: NoInfer<Callback<CallbackCtx, []>>
                ): void;
    /** `unlisten(target, callback): void` */
    unlisten<
                CallbackCtx extends object|void = void,
                CallbackArgs extends any[] = []
            >(
                target  : SubscribableObservable<CallbackCtx, CallbackArgs>,
                callback: NoInfer<Callback<CallbackCtx, CallbackArgs>>
            ): void;
    /** `unobserve(target, callback): void` */
    unobserve<
                CallbackCtx  extends object|void = void,
                CallbackArgs extends any[] = []
            >(
                target  : SubscribableObservable<CallbackCtx, CallbackArgs>,
                callback: NoInfer<Callback<CallbackCtx, CallbackArgs>>
            ): void;
    /** `isListening(target, callback): void` */
    isListening<
                CallbackCtx  extends object|void = void,
                CallbackArgs extends any[] = []
            >(
                target  : SubscribableObservable<CallbackCtx, CallbackArgs>,
                callback: NoInfer<Callback<CallbackCtx, CallbackArgs>>
            ): boolean;
    /** `trigger(target, ...args): void` */
    trigger<TriggerArgs extends any[] = []>(
                    target: TriggerableObservable<TriggerArgs>,
                    ...args: NoInfer<TriggerArgs>
                ): void;
    /** `triggerDrain(target, ...args): void`
     * 
     * Trigger the target, then clear it.
    */
    triggerDrain<TriggerArgs extends any[] = []>(
                    target: TriggerableObservable<TriggerArgs>
                            & ClearableObservable,
                    ...args: NoInfer<TriggerArgs>
                ): void;
    /** `canSkipTrigger(target): boolean`
     * 
     * The target isn't currently listened, therefore we can skip the trigger process.
     */
    canSkipTrigger<TriggerArgs extends any[] = []>(
                    target: TriggerableObservable<TriggerArgs>
                ): boolean;
    /** `clear(target): void` */
    clear(target: ClearableObservable): void;
}

export interface ObservableExtensions {

    ObservableObject: ObservableObjectClass;
    //ObservableProxy : void;

    /** `createHook(metadata)` */
    createHook<
                Meta extends Record<string, any> = {},
                Args extends any[]               = []
            >(metadata: Meta): Hook<Meta, Args>;

    /** `createOwnedHook(owner, metadata)` */
    createOwnedHook<
                    Owner extends object,
                    Meta extends Record<string, any> = {},
                    Args extends any[]               = []
                >(owner: Owner, metadata?: Meta): Hook<Meta & {owner: Owner}, Args>

    /** `hookFactory<ARGS>()`
     * Replace by ownedHookFactory ?
    */
    hookFactory<ARGS extends any[]>(): HookFactory<ARGS>;
}

/*
function 
*/

export type Extensions = DefineExtensionsFcts<ObservableExtensions, [
                                            ObsCtrl: ObservationControllerClass
                                        ]>;

export interface ObservableDetails {
    readonly ObservationController: ObservationControllerClass
}


export interface ObservableContract
                    extends ObservableDetails,
                            ObservableServices,
                            ObservableExtensions {}