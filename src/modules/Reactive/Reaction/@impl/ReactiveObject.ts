import { CALLBACKS } from "MWL@2026/modules/Callbacks/@contract/@types/WithCallbacks";
import { REACTION_NODE } from "../@contract/@types/ctrler";
import { ReactionNode, type ReactionDetails, type ReactiveObject } from "./@types";
import { ReactionNodeImpl } from "./ReactionNodeImpl";
import { CallbackList } from "MWL@2026/modules/Callbacks";

const ReactiveObject: ReactionDetails["ReactiveObject"]
    = class implements ReactiveObject {
        readonly [REACTION_NODE]: ReactionNode;
        readonly [CALLBACKS]    : CallbackList;

        constructor() {
            const node = new ReactionNodeImpl();

            this[REACTION_NODE] = node;
            this[CALLBACKS    ] = node[CALLBACKS];
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