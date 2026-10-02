import { type ReactiveObject } from "..";
import { REACTIVE_NODE } from "./internals";

// effect
export type Effect = () => void;

export type EffectScheduler = {
    schedule(effect: Effect): void;
    execute(): void;
}

// reactive
export type ReactiveScheduler = {
    schedule(reactive: ReactiveObject): void;
    flush(...reactives: readonly ReactiveObject[]): void;
}

// reactive object
export type ReactiveObject<L extends Link = any> = {
    readonly [REACTIVE_NODE]: ReactiveNode<L>;
}

export type PropagateCallback<L extends Link> = (link: L) => void;

export type ReactiveNode<L extends Link> = {

    readonly onPropagate: PropagateCallback<L>;
    readonly outgoingLinks: Link[];

    // impl details.
    reactionDepth  : number;
    reactionPending: boolean;
}

export type Link<ExtraProps extends Record<string, any> = {}> = {
    readonly src : ReactiveObject;
    readonly dst : ReactiveObject;
    readonly data: ExtraProps;
}

class X extends ReactiveObject {

    constructor() {
        super(() => {});
    }
    foo() {}
}

export type Link2<ExtraProps extends Record<string, any> = {}> = {
        readonly src : ReactiveObject;
        readonly dst : ReactiveObject;
        readonly execute: () => void;
    } & ExtraProps;

function foo<L extends Link2>(x: L) {
    return x;
}

const x = foo({
    src: new X(),
    dst: new X(),
    extra: 43,
    execute() {
        this.dst.foo();
    },
})

const y: Link2 = x;