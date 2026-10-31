import { reactionNode } from "../@contract/@types/ctrler";
import { executePendingReactionEffects } from "../@contract/services";
import { Link, ReactionNode, ReactiveObject } from "./@types";

function isPending(node: ReactionNode) {
    return node.reactionPending && node.pauseDepth === 0;
}

export class ReactionScheduler {

    schedule(target: ReactiveObject, link: Link|null = null) {

        const targetNode       = reactionNode(target);
        targetNode.pendingLink = link;

        if( targetNode.pauseDepth !== 0 ) {
            targetNode.reactionPending = true;
            return;
        }

        this.prepass  (targetNode);
        this.propagate(targetNode);
        
        executePendingReactionEffects();
    }

    flush(...targets: readonly ReactiveObject[]) {

        for(let i = 0; i < targets.length; ++i) {

            const node = reactionNode(targets[i]);

            if( ! isPending(node) )
                continue; // ignore

            ++node.reactionDepth; // avoid multi-reactions.
            this.prepass(node);
        }

        for(let i = 0; i < targets.length; ++i) {

            const node = reactionNode(targets[i]);

            if( ! isPending(node) )
                continue; // ignore

            --node.reactionDepth;
            node.reactionPending = false;
            this.propagate(node);
        }

        executePendingReactionEffects();
    }

    pauseReactions(...targets: readonly ReactiveObject[]) {
        for(let i = 0; i < targets.length; ++i)
            ++reactionNode(targets[i]).pauseDepth;
    }

    resumeReactions(...targets: readonly ReactiveObject[]) {

        for(let i = 0; i < targets.length; ++i)
            --reactionNode(targets[i]).pauseDepth;

        this.flush(...targets);
    }

    // storing links is necessary to detect and prevent loops.
    readonly stack = new Array<Link>();

    protected prepareNode(
                            target: ReactionNode,
                            link  : Link|null
                        ) {

        const nextLinks = target.outgoingLinks;

        for(let i = nextLinks.length - 1; i >= 0; --i) {

            const nextLink = nextLinks[i];
            if(link !== null && nextLink.dst === link.src)
                continue;

            const dstNode = nextLink.dst;
            if( dstNode.reactionDepth++ === 0 && dstNode.pauseDepth === 0 )
                this.stack.push(nextLink);
        }
    }

    protected prepass(target: ReactionNode) {

        this.prepareNode(target, target.pendingLink);

        while(this.stack.length) {
            const curLink = this.stack.pop()!;
            this.prepareNode(curLink.dst, curLink);
        }
    }

    protected processNode(target: ReactionNode, link: Link|null) {

        const nextLinks = target.outgoingLinks;
        for(let i = nextLinks.length - 1; i >= 0; --i) {

            const nextLink = nextLinks[i];
            if(link !== null && nextLink.dst === link.src)
                continue;

            const dstNode = nextLink.dst;

            if( --dstNode.reactionDepth === 0 ) {
                if( dstNode.pauseDepth !== 0 ) {
                    dstNode.pendingLink = nextLink;
                    continue;
                }
                this.stack.push(nextLink);
            }
        }
    }

    protected propagate(target: ReactionNode) {

        const pendingLink = target.pendingLink;
        if( pendingLink !== null ) {
            pendingLink.execute();
            target.pendingLink = null;
        }

        this.processNode(target, pendingLink);

        while(this.stack.length) {

            const curLink = this.stack.pop()!;
            curLink.execute();

            this.processNode(curLink.dst, curLink);
        }
    }
}