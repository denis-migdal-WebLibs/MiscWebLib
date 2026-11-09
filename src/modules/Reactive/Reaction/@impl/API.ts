import { ReactionScheduler } from "./ReactionScheduler";
import { Link, ReactionDetails } from "./@types";
import { NULL_OP } from "MWL@2026/@exports/types";
import { reactionNode } from "../@contract/@types/ctrler";
import { reactionEffect } from "../@contract/services";
import { createReactionNode } from "./ReactionNodeImpl";

const reactiveScheduler = new ReactionScheduler();

////
// ReactionScheduler
////

export const requestReaction: ReactionDetails["requestReaction"]
    = function requestReaction(target, link = null ) {
        reactiveScheduler.schedule(target, link);
    }

export const pauseReactions: ReactionDetails["pauseReactions"]
    = function(...targets) {
        reactiveScheduler.pauseReactions(...targets);
    }

export const resumeReactions: ReactionDetails["resumeReactions"]
    = function(...targets) {
        reactiveScheduler.resumeReactions(...targets);
    }

////
// Links
////

export const addLink: ReactionDetails["addLink"]
    = function(src, dst, execute = NULL_OP) {

        const srcNode = reactionNode(src);

        const link: Link = {
            src    : srcNode,
            dst    : reactionNode(dst),
            execute
        }

        srcNode.outgoingLinks.push(link);

        return link;
    }

export const attachReactionEffect: ReactionDetails["attachReactionEffect"]
    = function(target , callback) {

        const srcNode = reactionNode(target);

        const link: Link = {
            src    : srcNode,
            dst    : createReactionNode(),
            execute: reactionEffect(callback)
        }

        srcNode.outgoingLinks.push(link);
    }