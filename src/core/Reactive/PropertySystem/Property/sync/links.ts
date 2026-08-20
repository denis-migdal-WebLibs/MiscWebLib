import { NULL_OP } from "MWL@2026/core/types";
import { Link } from "../../ReactiveObject/link";
import { REACTIVE_NODE, ReactiveObject } from "../../ReactiveObject/ReactiveObject";
import { Property } from "../Property"
import { RWPropertyController } from "../PropertyController";

function propagateSync(this: Link) {
    const src = this.src as Property<any>;
    const dst = this.dst as Property<any>;

    (dst.controller as RWPropertyController<any>).clearValue();
    dst.value = src.value;
}

export function addSyncLink(src: Property<any>, dst: Property<any>) {
    src[REACTIVE_NODE].links.push({
        src,
        dst,
        propagate: propagateSync
    });
}

function propagateDependency(this: Link) {

    const dst = this.dst as Property<any>;
    (dst.controller as RWPropertyController<any>).clearValue();
}

export function addDependencyLink(src: Property<any>, dst: Property<any>) {

    src[REACTIVE_NODE].links.push({
        src,
        dst,
        propagate: propagateDependency
    });
}

export function addLink(src: ReactiveObject, dst: ReactiveObject) {

    const link = {
        src,
        dst,
        propagate: NULL_OP
    }
    src[REACTIVE_NODE].links.push(link);

    return link;
}

// Be-careful... link requires an onRemove(?)
export function removeLink(link: Link) {
    const links = link.src[REACTIVE_NODE].links;
    const idx = links.indexOf(link);
    links.splice(idx, 1)
}