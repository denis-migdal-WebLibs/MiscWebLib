import { REACTIVE_NODE } from "./internals";

// effect
export type Effect = () => void;

export type EffectScheduler = {
    schedule(effect: Effect): void;
    execute(): void;
}

// reactive
export type ReactiveSchedulerContract<NodeExtra extends Record<string, any>> = {
    schedule(
        reactive: ReactiveObjectContract<NodeExtra>,
        link   ?: LinkContract<NodeExtra>|null
    ): void;
    flush(...reactives: readonly ReactiveObjectContract<NodeExtra>[]): void;

    pauseReactions (...obj: readonly ReactiveObjectContract<NodeExtra>[]): void;
    resumeReactions(...obj: readonly ReactiveObjectContract<NodeExtra>[]): void;
}

// reactive object
export type LinkContract<NodeExtra extends Record<string, any>> = {
    readonly src : ReactiveNodeContract<NodeExtra>;
    readonly dst : ReactiveNodeContract<NodeExtra>;
    readonly execute: () => void;
};

export type ReactiveNodeContract<NodeExtra extends Record<string, any>> = {
    // we don't need to know Link's true type.
    readonly outgoingLinks: LinkContract<NodeExtra>[];
    //readonly target       : ReactiveObjectContract<NodeExtra>;
} & NodeExtra;

export type ReactiveObjectContract<NodeExtra extends Record<string, any>> = {
    readonly [REACTIVE_NODE]: ReactiveNodeContract<NodeExtra>;
}