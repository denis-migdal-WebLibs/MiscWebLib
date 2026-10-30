import { OBS_CTRLER, ObservableWith } from "./internals";

type Subscribable<
        CallbackCtx  extends object|void = void,
        CallbackArgs extends any[]       = [],
    > = {
        has   (callback: Callback<CallbackCtx, CallbackArgs>): boolean;
        add   (callback: Callback<CallbackCtx, CallbackArgs>): void;
        remove(callback: Callback<CallbackCtx, CallbackArgs>): void;

        call<A extends Prefixes<CallbackArgs>>(callback: Callback<CallbackCtx, A>, ...args: A): void;
    };

type Triggerable<
        TriggerArgs extends any[] = []
    > = {
        trigger(...args: TriggerArgs): void;

        canSkipTrigger(): boolean;
    };

type Clearable = {
        clear(): void;
    };

export type ObservationController<
        CallbackCtx  extends object|void = void,
        CallbackArgs extends any[]       = [],
        TriggerArgs  extends any[]       = CallbackArgs,
    > = Subscribable<CallbackCtx, CallbackArgs>
        & Triggerable<TriggerArgs>
        & Clearable;

/** `class ObservationController(triggerContext?)` */
export type ObservationControllerClass = {
    new<
        CallbackCtx  extends object|void = void,
        CallbackArgs extends any[]       = []
    >(
        ...args: [CallbackCtx]|(CallbackCtx extends void ? []: never)
    ): ObservationController<CallbackCtx, CallbackArgs>;
}

export type ObservableCtx<T> = {readonly invoker: T};

//////
// Object
/////

export interface ObservableObject<CallbackArgs extends any[] = []> 
        extends Observable<ObservableCtx<any>, CallbackArgs>
        {

    readonly [OBS_CTRLER]: ObservationController<ObservableCtx<this>, CallbackArgs>;
}

export type ObservableObjectClass = new <CallbackArgs extends any[] = []>() => ObservableObject<CallbackArgs>;

//////
// Hook
/////

export type Hook<
                T extends Record<string, any> = {},
                Args extends any[]            = []
            > = T & Observable<ObservableCtx<T>, Args>;

export type HookFactory<ARGS extends any[]> = {
    create<M extends Record<string, any>>(metadata: M): Hook<M, ARGS>;
};

//////
// Public
/////

export type SubscribableObservable<
        CallbackCtx extends object|void = void,
        CallbackArgs extends any[]       = [],
    > = ObservableWith<Subscribable<CallbackCtx, CallbackArgs>>;

export type TriggerableObservable<
        TriggerArgs extends any[] = []
    > = ObservableWith<Triggerable<TriggerArgs>>;

export type ClearableObservable   = ObservableWith<Clearable>;

export type Observable<
        CallbackCtx  extends object|void = void,
        TriggerArgs  extends any[]       = [],
        CallbackArgs extends any[]       = TriggerArgs,
    > =   SubscribableObservable<CallbackCtx, CallbackArgs>
        & TriggerableObservable<TriggerArgs>
        & ClearableObservable;

//////
// Helpers
/////

export type Callback<
                This extends object|void = void,
                Args extends any[]       = [],
            > = (this: This, ...args: Args) => void;

export type Prefixes<T extends any[], Acc extends any[] = []> =
    T extends [infer Head, ...infer Tail]
        ? Acc | Prefixes<Tail, [...Acc, Head]>
        : Acc;