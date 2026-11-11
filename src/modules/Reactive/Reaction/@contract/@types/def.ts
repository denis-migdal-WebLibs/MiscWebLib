import { WithImpl2 } from "MWL@2026/modules/@types/contracts/Impl";
import { REACTION_NODE } from "./ctrler";
import { WithCallbacks } from "MWL@2026/modules/Callbacks";

///////
// ReactionEffect
///////

export type ReactionEffect = () => void;

///////
// ReactionScheduler
///////

export type LinkContract<NodeImpl extends object>
    = WithImpl2<{
        readonly src : ReactionNodeContract<NodeImpl>;
        readonly dst : ReactionNodeContract<NodeImpl>;
        readonly execute: () => void;
        readonly remove : () => void;
    }, {
        readonly src : NodeImpl;
        readonly dst : NodeImpl;
    }>;

export type ReactionNodeContract<NodeImpl extends object>
    = WithImpl2<{
            readonly version: number
        },
        NodeImpl
        >;

export type ReactiveObjectContract<NodeImpl extends object>
    = WithImpl2<WithCallbacks & {
        readonly [REACTION_NODE]: ReactionNodeContract<NodeImpl>
    }, {
        readonly [REACTION_NODE]: NodeImpl;
    }>;