import { NO_VALUE } from "MWL@2026:core/types";
import PropertySlot from "./PropertySlot";

export type PropertyNode<T> = {
    notificationOrigin: unknown,
    slots: PropertySlot<T>[];
    bindings: [
        src: PropertySlot<T>,
        dst: PropertySlot<T>,
        order: number,
    ][]
}

let order = 0;

export function createPropertyNode<T>(): PropertyNode<T> {
    return {
        notificationOrigin: undefined,
        slots   : [],
        bindings: [],
    };
}

export function fusePropertySlots<T>(
                                    src: PropertySlot<T>,
                                    dst: PropertySlot<T>,
                                    id = ++order
                                ) {
    // clear dst.
    dst.controller.set!(NO_VALUE as any, NO_VALUE as any); // suppress internal value.

    // set controller
    const dstSlots = dst.controller.node.slots; // should be defined.
    for(let i = 0; i < dstSlots.length; ++i)
        dstSlots[i].controller = src.controller;
    
    fuseArray(  src.controller.node.slots,
                dstSlots);
    dstSlots.length = 1;

    const srcBindings = src.controller.node.bindings

    fuseArray(  srcBindings,
                dst.controller.node.bindings);
    dst.controller.node.bindings.length = 0;

    srcBindings.push([
        src,
        dst,
        id
    ]);
}

function fuseArray<T>(target: T[], values: T[]) {

    let offset = target.length;
    target.length += values.length;
    for(let i = 0; i < values.length; ++i)
        target[offset++] = values[i];
}