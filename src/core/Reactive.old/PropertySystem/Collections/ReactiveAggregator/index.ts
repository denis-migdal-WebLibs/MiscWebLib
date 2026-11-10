import { triggerReactiveObject } from "../../ReactiveObject/ReactiveScheduler";
import { ReactiveObject } from "../../ReactiveObject/ReactiveObject";
import { addLink, removeLink } from "../../Property/sync/links";
import { Link } from "../../ReactiveObject/link";

export class ReactiveAggregator extends ReactiveObject {

    readonly links = new Array<Link>();

    add(...targets: readonly ReactiveObject[]) {

        this.links.length = targets.length;
        for(let i = 0; i < targets.length; ++i)
            this.links[i] = addLink(targets[i], this);

        triggerReactiveObject(this);
    }

    replaceAll(...targets: readonly ReactiveObject[]) {

        for(let i = 0; i < this.links.length; ++i)
            removeLink(this.links[i]);
        
        this.add(...targets);
    }
}