import { EffectScheduler } from "../@contract";
import { REACTIVE_NODE } from "../@contract/internals";
import { Link, ReactiveNode, ReactiveObject, ReactiveScheduler } from "./types";

function isPending(node: ReactiveNode) {
    return node.reactionPending && node.pauseDepth === 0;
}

export class ReactiveSchedulerImpl implements ReactiveScheduler {

    protected readonly effects: EffectScheduler;

    constructor(effects: EffectScheduler) {
        this.effects = effects;
    }

    schedule(target: ReactiveObject, link: Link|null = null) {

        const targetNode       = target[REACTIVE_NODE];
        targetNode.pendingLink = link;

        if( targetNode.pauseDepth !== 0 ) {
            targetNode.reactionPending = true;
            return;
        }

        this.prepass  (targetNode);
        this.propagate(targetNode);
        
        this.effects.execute();
    }

    flush(...targets: readonly ReactiveObject[]) {

        for(let i = 0; i < targets.length; ++i) {

            const node = targets[i][REACTIVE_NODE];

            if( ! isPending(node) )
                continue; // ignore

            ++node.reactionDepth; // avoid multi-reactions.
            this.prepass(node);
        }

        for(let i = 0; i < targets.length; ++i) {

            const node = targets[i][REACTIVE_NODE];

            if( ! isPending(node) )
                continue; // ignore

            --node.reactionDepth;
            node.reactionPending = false;
            this.propagate(node);
        }

        this.effects.execute();
    }

    pauseReactions(...targets: readonly ReactiveObject[]) {
        for(let i = 0; i < targets.length; ++i)
            ++targets[i][REACTIVE_NODE].pauseDepth;
    }

    resumeReactions(...targets: readonly ReactiveObject[]) {

        for(let i = 0; i < targets.length; ++i)
            --targets[i][REACTIVE_NODE].pauseDepth;

        this.flush(...targets);
    }

    // storing links is necessary to detect and prevent loops.
    readonly stack = new Array<Link>();

    protected prepareNode(
                            target: ReactiveNode,
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

    protected prepass(target: ReactiveNode) {

        this.prepareNode(target, target.pendingLink);

        while(this.stack.length) {
            const curLink = this.stack.pop()!;
            this.prepareNode(curLink.dst, curLink);
        }
    }

    protected processNode(target: ReactiveNode, link: Link|null) {

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

    protected propagate(target: ReactiveNode) {

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