import { ReactionScheduler } from "./ReactionScheduler";
import { Link, ReactionDetails } from "./@types";
import { NULL_OP } from "MWL@2026/@exports/types";
import { reactionNode } from "../@contract/@types/ctrler";

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

        const link: Link = {
            src    : reactionNode(src),
            dst    : reactionNode(dst),
            execute
        }

        reactionNode(src).outgoingLinks.push(link);

        return link;
    }

/*

////
// Testing
////

export function addReactiveEffect(
                                    target: ReactiveObject,
                                    effect: () => void
                                ) {

    const fakeObj = new ReactiveObjectImpl();

    return addLink(    target,
                fakeObj,
                () => scheduleEffect(effect)
            );
}
*/