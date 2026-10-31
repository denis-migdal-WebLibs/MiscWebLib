import { ReactionServices } from "..";
import { ReactionEffectScheduler } from "./ReactionEffectScheduler";

const effectScheduler = new ReactionEffectScheduler();

export const executePendingReactionEffects: ReactionServices["executePendingReactionEffects"]
    = function () {
        effectScheduler.execute();
    }

export const addReactionEffect: ReactionServices["addReactionEffect"]
    = function (effect) {
        effectScheduler.schedule(effect);
    }

export const reactionEffect: ReactionServices["reactionEffect"]
    = function (callback) {
        return () => {
            effectScheduler.schedule(callback);
        }
    }
