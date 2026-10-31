import { LinkContract, ReactionEffect, ReactiveObjectContract } from "./@types/def";

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

    /**
     * Schedule an effect (executed at the end of the reaction).
     */
    addReactionEffect(effect: ReactionEffect): void;

    /**
     * Transform a callback into a function that will schedule an effect when called.
     */
    reactionEffect(callback: () => void): ReactionEffect;
}

export interface ReactionContract<NodeExtra extends Record<string, any>>
                    extends ReactionDetails<NodeExtra> {}