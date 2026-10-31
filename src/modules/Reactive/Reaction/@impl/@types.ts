import { LinkContract, ReactionNodeContract, ReactiveObjectContract } from "../@contract/@types/def";
import {ReactionDetails as ReactionDetailsContract} from "../@contract/";

export type ReactionNodeExtra = {
    reactionDepth  : number;

    pauseDepth     : number;
    reactionPending: boolean;
    pendingLink    : Link|null;
}

export type ReactionNode      = ReactionNodeContract     <ReactionNodeExtra>;
export type Link              = LinkContract             <ReactionNodeExtra>;
export type ReactiveObject    = ReactiveObjectContract   <ReactionNodeExtra>;

export type ReactionDetails = ReactionDetailsContract<ReactionNodeExtra>; 