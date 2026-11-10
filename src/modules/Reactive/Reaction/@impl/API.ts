import { ReactionScheduler } from "./ReactionScheduler";
import { Link, ReactionDetails } from "./@types";
import { NULL_OP } from "MWL@2026/@exports/types";
import { reactionNode } from "../@contract/@types/ctrler";
import { reactionEffect } from "../@contract/services";
import { createReactionNode } from "./ReactionNodeImpl";
import { impl } from "MWL@2026/modules/@types/contracts/Impl";

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

function defaultRemove(this: Link) {
    const link  = impl(this);
    const links = link.src.outgoingLinks;
    const idx   = links.indexOf(link);

    links.splice(idx, 1);
}

export const addLink: ReactionDetails["addLink"]
    = function(src, dst, execute = NULL_OP, remove = defaultRemove) {

        const srcNode = reactionNode(src);

        const link: Link = {
            src    : srcNode,
            dst    : reactionNode(dst),
            execute,
            remove,
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
            execute: reactionEffect(callback),
            remove : defaultRemove,
        }

        srcNode.outgoingLinks.push(link);
    }