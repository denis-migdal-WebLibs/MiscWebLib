import { LinkContract, ReactionNodeContract, ReactiveObjectContract } from "../@contract/@types/def";
import {ReactionDetails as ReactionDetailsContract} from "../@contract/";
import { impl, Impl } from "MWL@2026/modules/@types/contracts/Impl";
import { REACTION_NODE } from "../@contract/@types/ctrler";
import { CallbackList } from "MWL@2026/modules/Callbacks";
import { CALLBACKS } from "MWL@2026/modules/Callbacks/@contract/@types/WithCallbacks";

export type ReactionNodeImpl = {

    version             : number;
    
    // impl:
    readonly [CALLBACKS]: CallbackList;
    readonly outgoingLinks: Impl<LinkContract<ReactionNodeImpl>>[];

    reactionDepth  : number;

    pauseDepth     : number;
    reactionPending: boolean;
    pendingLink    : Impl<Link>|null;

};

export type ReactionDetails = ReactionDetailsContract<ReactionNodeImpl>; 

export type ReactionNode      = ReactionNodeContract     <ReactionNodeImpl>;
export type Link              = LinkContract             <ReactionNodeImpl>;
export type ReactiveObject    = ReactiveObjectContract   <ReactionNodeImpl>;

export function reactionNode(o: ReactiveObject) {
    return impl(o[REACTION_NODE])
}