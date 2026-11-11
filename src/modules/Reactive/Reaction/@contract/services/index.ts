import type { ReactionServices } from "..";
import { reactionNode } from "../@types/ctrler";

export const getVersion: ReactionServices["getVersion"]
    = function (target) {
        return reactionNode(target).version;
    }