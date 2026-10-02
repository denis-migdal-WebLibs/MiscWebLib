import { Cstr } from "MWL@2026/@exports/types";
import { Link, PropagateCallback, ReactiveNode, ReactiveObject } from "../@contract";
import { REACTIVE_NODE } from "../@contract/internals";

class ReactiveNodeImpl<L extends Link> implements ReactiveNode<L> {
    
    readonly onPropagate;

    constructor(onPropagate: PropagateCallback<L>) {
        this.onPropagate = onPropagate;
    }

    readonly outgoingLinks = new Array<Link>();

    reactionDepth  = 0;
    reactionPending= false;
}

export class ReactiveObjectImpl<L extends Link = any> implements ReactiveObject {

    readonly [REACTIVE_NODE]: ReactiveNode<L>;

    constructor(onPropagate: PropagateCallback<L>) {
        this[REACTIVE_NODE] = new ReactiveNodeImpl(onPropagate);
    }
}

export function ReactiveMixin<
            Base  extends Cstr<{}, any[]>
        > (base: Base) {

    return class Reactive extends base {
        readonly [REACTIVE_NODE]: ReactiveNode<any> = new ReactiveNodeImpl( () => {});
    }
}