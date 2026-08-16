import { ObservableObject } from "MWL@2026/exports/Reactive/Events";
import { ReactiveNode } from "./ReactiveNode";

export const REACTIVE_NODE = Symbol();

export class ReactiveObject extends ObservableObject {
    readonly [REACTIVE_NODE] = new ReactiveNode();
}