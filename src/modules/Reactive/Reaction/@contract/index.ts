import { LinkContract, ReactionEffect, ReactiveObjectContract } from "./@types/def";

export interface ReactionServices {

    getVersion(target: ReactiveObjectContract<any>): number;

    /**
     * Schedule an effect (executed at the end of the reaction).
     */
    scheduleReactionEffect(effect: ReactionEffect): void;

    /**
     * Transform a callback into a function that will schedule an effect when called.
     */
    reactionEffect(callback: () => void): ReactionEffect;

    // internal
    executePendingReactionEffects(): void;
}

export interface ReactionDetails<NodeImpl extends object> {

    ReactiveObject: new() => ReactiveObjectContract<NodeImpl>;

    //TODO: services (redir API)
    requestReaction(target: ReactiveObjectContract<NodeImpl>,
                    link ?: LinkContract<NodeImpl>|null
                ): void;

    pauseReactions(...targets: readonly ReactiveObjectContract<NodeImpl>[]): void;

    resumeReactions(...targets: readonly ReactiveObjectContract<NodeImpl>[]): void;

    addLink(
            src     : ReactiveObjectContract<NodeImpl>,
            dst     : ReactiveObjectContract<NodeImpl>,
            execute?: ReactionEffect,
        ): LinkContract<NodeImpl>

    attachReactionEffect(
                target  : ReactiveObjectContract<NodeImpl>,
                callback: ReactionEffect
            ): void;
}

export interface ReactionImpl<NodeImpl extends object>
                    extends ReactionDetails<NodeImpl> {}

export interface ReactionContract<NodeImpl extends object>
                    extends ReactionImpl<NodeImpl>,
                            ReactionServices {}