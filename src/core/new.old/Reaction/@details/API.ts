import { NULL_OP } from "MWL@2026/core/types";
import { REACTIVE_NODE } from "../@contract/internals";
import { EffectSchedulerImpl } from "./EffectScheduler";
import { ReactiveObjectImpl } from "./ReactiveNode";
import { ReactiveSchedulerImpl } from "./ReactiveScheduler";
import { Link, ReactiveObject } from "./types";

export function isReactive(obj: {}): obj is ReactiveObject {
    return REACTIVE_NODE in obj;
}

export function addLink(
                        src    : ReactiveObject,
                        dst    : ReactiveObject,
                        execute: () => void = NULL_OP) {

    const link: Link = {
        src    : src[REACTIVE_NODE],
        dst    : dst[REACTIVE_NODE],
        execute
    }

    src[REACTIVE_NODE].outgoingLinks.push(link);

    return link;
}

////
// Effects
////

export const effectScheduler   = new EffectSchedulerImpl();

export function effect(callback: () => void) {
    return () => effectScheduler.schedule(callback);
}

////
// Scheduler
////

export const reactiveScheduler = new ReactiveSchedulerImpl(effectScheduler);

export function requestReaction(
                                target: ReactiveObject,
                                link: Link|null = null
                            ) {
    reactiveScheduler.schedule(target, link);
}

export function pauseReactions(...targets: readonly ReactiveObject[]) {
    reactiveScheduler.pauseReactions(...targets);
}

export function resumeReactions(...targets: readonly ReactiveObject[]) {
    reactiveScheduler.resumeReactions(...targets);
}

////
// Testing
////

export function scheduleEffect(callback: () => void) {
    effectScheduler.schedule(callback);
}

export function addReactiveEffect(
                                    target: ReactiveObject,
                                    effect: () => void
                                ) {

    const fakeObj = new ReactiveObjectImpl();

    return addLink(    target,
                fakeObj,
                () => scheduleEffect(effect)
            );
}