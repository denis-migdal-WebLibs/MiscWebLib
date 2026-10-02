import { ReactiveObject } from "../@contract";
import { REACTIVE_NODE } from "../@contract/internals";
import { EffectSchedulerImpl } from "../@details/EffectScheduler";
import { ReactiveSchedulerImpl } from "../@details/ReactiveScheduler";

// internals.
const effectScheduler   = new EffectSchedulerImpl();
const reactiveScheduler = new ReactiveSchedulerImpl(effectScheduler);

// API
export function requestReaction(target: ReactiveObject) {
    reactiveScheduler.schedule(target);
}

export function pauseReactions(...targets: readonly ReactiveObject[]) {
    for(let i = 0; i < targets.length; ++i)
        ++targets[i][REACTIVE_NODE].reactionDepth;
}

export function resumeReactions(...targets: readonly ReactiveObject[]) {

    for(let i = 0; i < targets.length; ++i)
        --targets[i][REACTIVE_NODE].reactionDepth;

    reactiveScheduler.flush(...targets);
}