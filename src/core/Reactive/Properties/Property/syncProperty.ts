import { FCT_FALSE, NO_VALUE } from "MWL@2026:core/types";
import { SignalInstance } from "../Controllers/Signal";
import { ValueInstance } from "../Controllers/Value";
import { triggerProperty } from "./PropertyNotifyScheduler";
import PropertySlot from "./PropertySlot";
import { fusePropertySlots } from "./PropertyNode";

export function unsyncProperty<T>(srcSlot: PropertySlot<T>,
                                  dstSlot: PropertySlot<T>) {

    // both should reference the same controller
    if( __DEBUG__ && srcSlot.controller !== dstSlot.controller )
        throw new Error("Properties aren't sync");

    const controller = srcSlot.controller;
    let bindings = controller.node.bindings;
    const idx = bindings.findIndex( (binding) => {
        return binding[0] === srcSlot && binding[1] === dstSlot
            || binding[0] === dstSlot && binding[1] === srcSlot
    })

    bindings.splice(idx, 1)
    bindings = bindings.toSorted( (a,b) => a[2]-b[2] );
    controller.node.bindings.length = 0;

    const slots = controller.node.slots.slice(1);
    for(let i = 0; i < slots.length; ++i)
        slots[i].controller = slots[i].originalController;

    controller.node.slots.length = 1;

    for(let i = 0; i < bindings.length; ++i)
        fusePropertySlots(bindings[i][0], bindings[i][1], bindings[i][2]);

    for(let i = 0; i < slots.length; ++i)
        if( slots[i].get() === NO_VALUE )
            slots[i].controller.set(controller.get(),
                                    controller.stamp);
}

export function syncProperty<T>(srcSlot: PropertySlot<T>,
                                dstSlot: PropertySlot<T>) {

    const swap = needsSwap(srcSlot, dstSlot);

    if( swap === null )
        return false;
    
    if( swap ) {
        const tmp = dstSlot;
        dstSlot = srcSlot ; srcSlot = tmp;
    }

    const notify = needsNotify(srcSlot, dstSlot);

    fusePropertySlots(srcSlot, dstSlot);
    
    if( notify )
        triggerProperty(dstSlot.controller, null);

    return true;
}

function needsNotify<T>(
                    src: PropertySlot<T>,
                    dst: PropertySlot<T>
                ) {

    // should be correct. View and its source may share a Symbol, but you shouldn't sync them (loop).
    // should not require to compute values.
    return src.stamp !== dst.stamp;
}

function needsSwap<T>(srcSlot: PropertySlot<T>,
                      dstSlot: PropertySlot<T>) {

    const src = srcSlot.controller;
    const dst = dstSlot.controller;
    
    if( dst.set === FCT_FALSE ) {
        if( src.set === FCT_FALSE )
            return null;

        return true;
    }

    if(  src instanceof ValueInstance
      && dst instanceof SignalInstance)
        return true;

    return false;
}