import { Cstr } from "MWL@2026/@exports/types";
import { REACTIVE_NODE } from "../@contract/internals";
import { Link, ReactiveNode, ReactiveObject } from "./types";

export class ReactiveNodeImpl implements ReactiveNode {
    
    readonly outgoingLinks = new Array<Link>();
    
    reactionDepth  = 0;
    reactionPending= false;

    pauseDepth     = 0;
    pendingLink    = null;
}


export class ReactiveObjectImpl implements ReactiveObject {
    readonly [REACTIVE_NODE]: ReactiveNode = new ReactiveNodeImpl();
}

// really useful ?
export function ReactiveMixin<
            Base  extends Cstr<{}, any[]>
        > (base: Base) {

    return class Reactive extends base {
        readonly [REACTIVE_NODE]: ReactiveNode = new ReactiveNodeImpl();
    }
}