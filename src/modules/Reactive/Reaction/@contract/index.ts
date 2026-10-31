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

export interface ReactionDetails<ReactionNodeExtra extends Record<string, any>> {

    ReactiveObject: new() => ReactiveObjectContract<ReactionNodeExtra>;

    requestReaction(target: ReactiveObjectContract<ReactionNodeExtra>,
                    link ?: LinkContract<ReactionNodeExtra>|null
                ): void;

    pauseReactions(...targets: readonly ReactiveObjectContract<ReactionNodeExtra>[]): void;

    resumeReactions(...targets: readonly ReactiveObjectContract<ReactionNodeExtra>[]): void;

    addLink(
            src     : ReactiveObjectContract<ReactionNodeExtra>,
            dst     : ReactiveObjectContract<ReactionNodeExtra>,
            execute?: ReactionEffect
        ): LinkContract<ReactionNodeExtra>
}

export interface ReactionImpl<NodeExtra extends Record<string, any>>
                    extends ReactionDetails<NodeExtra> {}

export interface ReactionContract<NodeExtra extends Record<string, any>>
                    extends ReactionImpl<NodeExtra>,
                            ReactionServices {}