import {LinkContract, ReactiveNodeContract, ReactiveObjectContract, ReactiveSchedulerContract} from "../@contract";

type Extra = {
    reactionDepth  : number;

    pauseDepth     : number;
    reactionPending: boolean;
    pendingLink    : Link|null;
}

export type ReactiveNode   = ReactiveNodeContract<Extra>;
export type Link           = LinkContract<Extra>;
export type ReactiveObject = ReactiveObjectContract<Extra>;

export type ReactiveScheduler = ReactiveSchedulerContract<Extra>;