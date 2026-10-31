import { Link, ReactionNode } from "./@types";

const ReactionNode = class implements ReactionNode {
    
    readonly outgoingLinks = new Array<Link>();
    
    reactionDepth  = 0;
    reactionPending= false;

    pauseDepth     = 0;
    pendingLink    = null;
}

export {ReactionNode};