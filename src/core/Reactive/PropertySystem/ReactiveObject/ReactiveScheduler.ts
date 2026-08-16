import { hasListeners, triggerEvent } from "MWL@2026/core/Reactive/Observers/Observable";
import { REACTIVE_NODE, ReactiveObject } from "./ReactiveObject";
import { Link } from "./link";
import { incrVersion } from "./ReactiveNode";

export class ReactiveScheduler {

    propagationPaused = false;

    readonly stack = new Array<Link>();
    readonly pendingPropagations  = new Array<ReactiveObject>();
    readonly pendingNotifications = new Array<ReactiveObject>();

    trigger(target: ReactiveObject) {

        this.propagateTrigger(target);

        if( this.propagationPaused ) {
            this.pendingPropagations.push(target);
            return;
        }

        this.propagateValue(target);
        this.notify();
    }

    pausePropagation() {
        this.propagationPaused = true;
    }
    resumePropagation() {

        for(let i = 0; i < this.pendingPropagations.length; ++i)
            this.propagateValue(this.pendingPropagations[i]);

        this.pendingPropagations.length = 0;

        this.notify();
    }

    protected propagateTrigger(target: ReactiveObject) {

        const links = target[REACTIVE_NODE].links;
        
        for(let i = links.length - 1; i >= 0; --i)
            if( links[i].dst[REACTIVE_NODE].triggerDepth++ === 0 )
                this.stack.push(links[i]);

        while(this.stack.length) {

            const curLink = this.stack.pop()!;

            const nextLinks = curLink.dst[REACTIVE_NODE].links;
            for(let i = nextLinks.length - 1; i >= 0; --i) {
                const nextLink = nextLinks[i];
                if(nextLink.dst === curLink.src)
                    continue;

                if( nextLink.dst[REACTIVE_NODE].triggerDepth++ === 0 )
                    this.stack.push(nextLink);
            }
        }
    }

    protected propagateValue(target: ReactiveObject) {

        this.scheduleNotify(target);
        incrVersion(target[REACTIVE_NODE]);

        const links = target[REACTIVE_NODE].links;
        for(let i = links.length - 1; i >= 0; --i)
            if( --links[i].dst[REACTIVE_NODE].triggerDepth === 0 )
                this.stack.push(links[i]);

        while(this.stack.length) {

            const curLink = this.stack.pop()!;

            curLink.propagate();
            incrVersion(curLink.dst[REACTIVE_NODE]);
            this.scheduleNotify(curLink.dst);

            const nextLinks = curLink.dst[REACTIVE_NODE].links;
            for(let i = nextLinks.length - 1; i >= 0; --i) {
                const nextLink = nextLinks[i];
                if(nextLink.dst === curLink.src)
                    continue;

                if( --nextLink.dst[REACTIVE_NODE].triggerDepth === 0 ) {
                    this.stack.push(nextLink);
                }
            }
        }
    }

    protected scheduleNotify(target: ReactiveObject) {
        if( ! hasListeners(target) )
            return;
        this.pendingNotifications.push(target);
    }

    protected notify() {

        // re-entry is forbidden.

        for(let i = 0; i < this.pendingNotifications.length; ++i)
            triggerEvent(this.pendingNotifications[i]);

        this.pendingNotifications.length = 0;
    }
}

const reactiveScheduler = new ReactiveScheduler();

export function pauseReactions() {
    reactiveScheduler.pausePropagation();
}
export function resumeReactions() {
    reactiveScheduler.resumePropagation();
}


export function triggerReactiveObject(target: ReactiveObject) {
    reactiveScheduler.trigger(target);
}