import { attachReactionEffect, ReactiveObject } from "MWL@2026/modules/Reactive/Reaction";
import { ObservableCtx, ObservableObject } from "../@contract/@types/def";
import { OBS_CTRLER } from "../@contract/@types/ctrler";
import { ObservationController } from "../@impl/ObservationController";
import { trigger } from "../@contract/services";

type Mutable<T> = {
    -readonly [K in keyof T]: T[K]
}

type Observable<T>      = T & ObservableObject;
type MaybeObservable<T> = T & Partial<Mutable<ObservableObject>>;

export function observifyReactiveObject(
                                target: MaybeObservable<ReactiveObject>
                            ) : asserts target is Observable<ReactiveObject> {

    if( OBS_CTRLER in target )
        return;

    target[OBS_CTRLER] = new ObservationController<
                                        ObservableCtx<unknown>
                                    >({invoker: target});

    attachReactionEffect(
                            target,
                            () => trigger(target as Observable<ReactiveObject>)
                        );
}