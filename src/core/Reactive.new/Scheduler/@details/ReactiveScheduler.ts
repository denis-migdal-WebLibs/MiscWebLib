import { EffectScheduler, Link, ReactiveNode, ReactiveObject, ReactiveScheduler } from "../@contract";
import { REACTIVE_NODE } from "../@contract/internals";

function isPending(node: ReactiveNode<any>) {
    return node.reactionPending && node.reactionDepth === 0;
}

export class ReactiveSchedulerImpl implements ReactiveScheduler {

    protected readonly effects: EffectScheduler;

    constructor(effects: EffectScheduler) {
        this.effects = effects;
    }

    schedule(target: ReactiveObject) {

        if( target[REACTIVE_NODE].reactionDepth !== 0 ) {
            target[REACTIVE_NODE].reactionPending = true;
            return;
        }

        this.prepass  (target);
        this.propagate(target);
        
        this.effects.execute();
    }

    flush(...targets: readonly ReactiveObject[]) {

        for(let i = 0; i < targets.length; ++i) {
            if( ! isPending(targets[i][REACTIVE_NODE]) )
                continue; // ignore

            this.prepass(targets[i]);
        }

        for(let i = 0; i < targets.length; ++i) {
            if( ! isPending(targets[i][REACTIVE_NODE]) )
                continue; // ignore

            targets[i][REACTIVE_NODE].reactionPending = false;
            this.propagate(targets[i]);
        }

        this.effects.execute();
    }

    // storing links is necessary to detect and prevent loops.
    readonly stack = new Array<Link>();

    protected prepass(target: ReactiveObject) {

        const links = target[REACTIVE_NODE].outgoingLinks;
        
        for(let i = links.length - 1; i >= 0; --i) {
            if( links[i].dst[REACTIVE_NODE].reactionDepth++ === 0 )
                this.stack.push(links[i]);
        }

        while(this.stack.length) {

            const curLink = this.stack.pop()!;

            const nextLinks = curLink.dst[REACTIVE_NODE].outgoingLinks;
            for(let i = nextLinks.length - 1; i >= 0; --i) {
                const nextLink = nextLinks[i];
                if(nextLink.dst === curLink.src)
                    continue;

                if( nextLink.dst[REACTIVE_NODE].reactionDepth++ === 0 )
                    this.stack.push(nextLink);
            }
        }
    }

    protected propagate(target: ReactiveObject) {

        target[REACTIVE_NODE].onPropagate(null);

        const links = target[REACTIVE_NODE].outgoingLinks;
        for(let i = links.length - 1; i >= 0; --i) {
            if( --links[i].dst[REACTIVE_NODE].reactionDepth === 0 )
                this.stack.push(links[i]);
        }

        while(this.stack.length) {

            const curLink = this.stack.pop()!;

            curLink.dst[REACTIVE_NODE].onPropagate(curLink);

            const nextLinks = curLink.dst[REACTIVE_NODE].outgoingLinks;
            for(let i = nextLinks.length - 1; i >= 0; --i) {
                const nextLink = nextLinks[i];
                if(nextLink.dst === curLink.src)
                    continue;

                if( --nextLink.dst[REACTIVE_NODE].reactionDepth === 0 ) {
                    this.stack.push(nextLink);
                }
            }
        }
    }
}