import { Impl } from "MWL@2026/modules/@types/contracts/Impl";
import { ReactionNodeImpl, Link, ReactionNode } from "./@types";

const ReactionNodeImpl = class implements ReactionNodeImpl {
    
    readonly outgoingLinks = new Array<Impl<Link>>();
    
    version        = 0;

    reactionDepth  = 0;
    reactionPending= false;

    pauseDepth     = 0;
    pendingLink    = null;
}

export function createReactionNode() {
    return new ReactionNodeImpl as ReactionNode;
}

export {ReactionNodeImpl};