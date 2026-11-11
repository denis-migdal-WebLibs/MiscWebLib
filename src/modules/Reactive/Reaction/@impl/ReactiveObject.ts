import { CALLBACKS, setCallbacks } from "MWL@2026/modules/Callbacks/@contract/@types/WithCallbacks";
import { REACTION_NODE } from "../@contract/@types/ctrler";
import { reactionNode, type ReactionDetails, type ReactiveObject } from "./@types";
import { createReactionNode } from "./ReactionNodeImpl";
import { CallbackList, getCallbacks } from "MWL@2026/modules/Callbacks";

const ReactiveObject: ReactionDetails["ReactiveObject"]
    = class implements ReactiveObject {

        readonly [REACTION_NODE] = createReactionNode();

        get [CALLBACKS](): CallbackList|null {
            return getCallbacks(reactionNode(this));
        }
        set [CALLBACKS](callbacks: CallbackList|null) {
            setCallbacks(reactionNode(this), callbacks);
        }
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