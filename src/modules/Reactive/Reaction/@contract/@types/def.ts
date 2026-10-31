import { WithImpl } from "MWL@2026/modules/@types/contracts/Impl";
import { REACTION_NODE } from "./ctrler";

///////
// ReactionEffect
///////

export type ReactionEffect = () => void;

///////
// ReactionScheduler
///////

export type LinkContract<NodeImpl extends object> = {
    readonly src : ReactionNodeContract<NodeImpl>;
    readonly dst : ReactionNodeContract<NodeImpl>;
    readonly execute: () => void;
} & WithImpl<{
    readonly src : NodeImpl;
    readonly dst : NodeImpl;
    readonly execute: () => void;
}>;

export type ReactionNodeContract<NodeImpl extends object> = WithImpl<NodeImpl>;

export type ReactiveObjectContract<NodeImpl extends object> = {
    readonly [REACTION_NODE]: ReactionNodeContract<NodeImpl>;
} & WithImpl<{
    readonly [REACTION_NODE]: NodeImpl;
}>;