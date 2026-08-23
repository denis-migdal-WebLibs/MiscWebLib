import { hasListeners, triggerEvent } from "MWL@2026/core/Reactive/Observers/Observable";
import { REACTIVE_NODE, ReactiveObject } from "./ReactiveObject";
import { Link } from "./link";
import { incrVersion } from "./ReactiveNode";

class Propagation {

    protected depth = 0;
    readonly callback: () => void;

    constructor(callback: () => void) {
        this.callback = callback;
    }

    pause() {
        ++this.depth;
    }
    resume() {
        --this.depth;

        if( this.depth === 0)
            this.callback();
    }

    get isPaused() {
        return this.depth !== 0;
    }
}

export class ReactiveScheduler {

    readonly propagation = new Propagation(() => this.resumePendingPropagations());

    readonly stack = new Array<Link>();
    readonly pendingPropagations  = new Array<ReactiveObject>();
    readonly pendingNotifications = new Array<ReactiveObject>();

    trigger(target: ReactiveObject) {

        this.propagateTrigger(target);

        //TODO: fix...
        if( this.propagation.isPaused 
            || target[REACTIVE_NODE].triggerDepth !== 0
        ) {
            this.pendingPropagations.push(target);
            return;
        }

        this.propagateValue(target);
        this.notify();
    }

    protected propagateTrigger(target: ReactiveObject) {

        const links = target[REACTIVE_NODE].links;
        
        for(let i = links.length - 1; i >= 0; --i) {
            if( links[i].dst[REACTIVE_NODE].triggerDepth++ === 0 )
                this.stack.push(links[i]);
        }

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

    protected resumePendingPropagations() {
        for(let i = 0; i < this.pendingPropagations.length; ++i)
            this.propagateValue(this.pendingPropagations[i]);
        this.pendingPropagations.length = 0;
        
        this.notify();
    }

    protected propagateValue(target: ReactiveObject) {

        this.scheduleNotify(target);
        incrVersion(target[REACTIVE_NODE]);

        const links = target[REACTIVE_NODE].links;
        for(let i = links.length - 1; i >= 0; --i) {
            if( --links[i].dst[REACTIVE_NODE].triggerDepth === 0 )
                this.stack.push(links[i]);
        }

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

export function triggerReactiveObject(target: ReactiveObject) {
    reactiveScheduler.trigger(target);
}

/***/

export function pauseReactions2(target: ReactiveObject) {
    ++target[REACTIVE_NODE].triggerDepth;
}

export function resumeReactions2(target: ReactiveObject) {

    // re-entry
    if( --target[REACTIVE_NODE].triggerDepth !== 0)
        return;
    
    // we assume the object must have been triggered.
    triggerReactiveObject(target);
}

/***/

export function atomicReaction( callback: () => void ) {
    pauseReactions();
    callback();
    resumeReactions();
}

export function areReactionsPaused() {
    return reactiveScheduler.propagation.isPaused;
}

export function pauseReactions() {
    reactiveScheduler.propagation.pause();
}
export function resumeReactions() {
    reactiveScheduler.propagation.resume();
}

export function atomicAssign<T extends Record<string, any>>(
                                                    target: T,
                                                    source: Partial<NoInfer<T>>
                                                ) {
    reactiveScheduler.propagation.pause();

    Object.assign(target, source);

    reactiveScheduler.propagation.resume();
}
