import type { ReactionServices } from "..";
import { reactionNode } from "../@types/ctrler";
import { ReactionEffectScheduler } from "./ReactionEffectScheduler";

const effectScheduler = new ReactionEffectScheduler();

export const getVersion: ReactionServices["getVersion"]
    = function (target) {
        return reactionNode(target).version;
    }

export const executePendingReactionEffects: ReactionServices["executePendingReactionEffects"]
    = function () {
        effectScheduler.execute();
    }

export const scheduleReactionEffect: ReactionServices["scheduleReactionEffect"]
    = function (effect) {
        effectScheduler.schedule(effect);
    }

export const reactionEffect: ReactionServices["reactionEffect"]
    = function (callback) {
        return () => {
            effectScheduler.schedule(callback);
        }
    }
