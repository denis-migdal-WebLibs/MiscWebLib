import { ReactionScheduler } from "./ReactionScheduler";
import { Link, ReactionDetails, reactionNode, ReactiveObject } from "./@types";
import { NULL_OP } from "MWL@2026/modules/@types";
import { REACTION_NODE } from "../@contract/@types/ctrler";
import { Impl, impl } from "MWL@2026/modules/@types/contracts/Impl";
import { ReactionNodeImpl } from "./ReactionNodeImpl";

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

export const isReactive: ReactionDetails["isReactive"]
    = function(target): target is ReactiveObject {
        if( ! (REACTION_NODE in target) )
            return false;

        return target[REACTION_NODE] instanceof ReactionNodeImpl;
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

        const link: Impl<Link> = {
            src    : srcNode,
            dst    : reactionNode(dst),
            execute,
            remove,
        }

        srcNode.outgoingLinks.push(link);

        return link;
    }


export const removeLink: ReactionDetails["removeLink"]
    = function(src, dst) {

        const links = reactionNode(src).outgoingLinks;
        const dstNode = reactionNode(dst);

        const idx = links.findIndex( link => link.dst === dstNode);

        __ASSERT__(idx !== -1, "DST not found");

        links[idx].remove();
        links.splice(idx, 1);
    }