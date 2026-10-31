import { REACTION_NODE } from "./ctrler";

///////
// ReactionEffect
///////

export type ReactionEffect = () => void;

///////
// ReactionScheduler
///////

export type LinkContract<NodeExtra extends Record<string, any>> = {
    readonly src : ReactionNodeContract<NodeExtra>;
    readonly dst : ReactionNodeContract<NodeExtra>;
    readonly execute: () => void;
};

export type ReactionNodeContract<NodeExtra extends Record<string, any>> = {
    // we don't need to know Link's true type.
    readonly outgoingLinks: LinkContract<NodeExtra>[];
    //TODO: version here
} & NodeExtra;

export type ReactiveObjectContract<NodeExtra extends Record<string, any>> = {
    readonly [REACTION_NODE]: ReactionNodeContract<NodeExtra>;
}