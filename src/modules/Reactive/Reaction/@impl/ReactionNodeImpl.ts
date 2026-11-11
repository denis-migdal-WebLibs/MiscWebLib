import { Impl } from "MWL@2026/modules/@types/contracts/Impl";
import { ReactionNodeImpl, Link, ReactionNode } from "./@types";
import { CALLBACKS } from "MWL@2026/modules/Callbacks/@contract/@types/WithCallbacks";
import { CallbackList } from "MWL@2026/modules/Callbacks";

const ReactionNodeImpl = class implements ReactionNodeImpl {
    
    version        = 0;

    // impl
    readonly outgoingLinks = new Array<Impl<Link>>();
    readonly [CALLBACKS]   = new CallbackList();

    reactionDepth  = 0;
    reactionPending= false;

    pauseDepth     = 0;
    pendingLink    = null;
}

export function createReactionNode() {
    return new ReactionNodeImpl() as ReactionNode;
}

export {ReactionNodeImpl};