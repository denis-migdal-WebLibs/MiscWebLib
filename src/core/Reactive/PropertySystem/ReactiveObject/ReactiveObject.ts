import { ObservableObject } from "MWL@2026/modules/Observable";
import { ReactiveNode } from "./ReactiveNode";
import { ObservableCtx } from "MWL@2026/@contracts/Observable/@types/def";
import { ObservableProxy } from "MWL@2026/modules/Observable/ObservableProxy";

export const REACTIVE_NODE = Symbol();

export class ReactiveObject extends ObservableObject {
    readonly [REACTIVE_NODE] = new ReactiveNode();
}

export class ReactiveProxy<T extends object|void> extends ObservableProxy<ObservableCtx<T>> {
    readonly [REACTIVE_NODE]: ReactiveNode;
    constructor(target: ReactiveProxy<T>) {
        super(target);
        this[REACTIVE_NODE] = target[REACTIVE_NODE];
    }
}