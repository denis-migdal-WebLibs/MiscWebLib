import { LinkContract, ReactionEffect, ReactiveObjectContract } from "./@types/def";

export interface ReactionServices {

    /**
     * Schedule an effect (executed at the end of the reaction).
     */
    addReactionEffect(effect: ReactionEffect): void;

    /**
     * Transform a callback into a function that will schedule an effect when called.
     */
    reactionEffect(callback: () => void): ReactionEffect;

    // internal
    executePendingReactionEffects(): void;
}

export interface ReactionDetails<NodeImpl extends object> {

    ReactiveObject: new() => ReactiveObjectContract<NodeImpl>;

    requestReaction(target: ReactiveObjectContract<NodeImpl>,
                    link ?: LinkContract<NodeImpl>|null
                ): void;

    pauseReactions(...targets: readonly ReactiveObjectContract<NodeImpl>[]): void;

    resumeReactions(...targets: readonly ReactiveObjectContract<NodeImpl>[]): void;

    addLink(
            src     : ReactiveObjectContract<NodeImpl>,
            dst     : ReactiveObjectContract<NodeImpl>,
            execute?: ReactionEffect
        ): LinkContract<NodeImpl>
}

export interface ReactionImpl<NodeImpl extends object>
                    extends ReactionDetails<NodeImpl> {}

export interface ReactionContract<NodeImpl extends object>
                    extends ReactionImpl<NodeImpl>,
                            ReactionServices {}