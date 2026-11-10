//TODO: could split contract/impl.

import { addLink, Link, ReactiveObject, requestReaction } from "MWL@2026/modules/Reactive/Reaction";

export class ReactiveAggregator extends ReactiveObject {

    readonly links = new Array<Link>();

    add(...targets: readonly ReactiveObject[]) {

        this.links.length = targets.length;
        for(let i = 0; i < targets.length; ++i)
            this.links[i] = addLink(targets[i], this);

        requestReaction(this);
    }

    replaceAll(...targets: readonly ReactiveObject[]) {

        for(let i = 0; i < this.links.length; ++i)
            this.links[i].remove();
        
        this.add(...targets);
    }
}