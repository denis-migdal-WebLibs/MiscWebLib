import { Link } from "./link";

// 0 is a reserved special value.
let id = 0;

export function incrVersion(node: ReactiveNode) {
    node.version = ++id;
}

export class ReactiveNode {
    readonly links = new Array<Link>();

    triggerDepth   = 0;
    triggerPending = false;

    version: number;

    constructor() {
        this.version = ++id;
    }
}