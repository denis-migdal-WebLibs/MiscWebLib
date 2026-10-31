import { REACTION_NODE } from "../@contract/@types/ctrler";
import type { ReactionDetails, ReactiveObject } from "./@types";
import { createReactionNode } from "./ReactionNodeImpl";

const ReactiveObject: ReactionDetails["ReactiveObject"]
    = class implements ReactiveObject {
        readonly [REACTION_NODE] = createReactionNode();
    }

export {ReactiveObject};

/*
// really useful ?
export function ReactiveMixin<
            Base  extends Cstr<{}, any[]>
        > (base: Base) {

    return class Reactive extends base {
        readonly [REACTION_NODE]: ReactionNode = new ReactiveNodeImpl();
    }
}
*/