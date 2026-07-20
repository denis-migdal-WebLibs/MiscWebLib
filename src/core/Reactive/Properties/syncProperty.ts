import { FCT_FALSE } from "MWL@2026:core/types";
import { SignalInstance } from "./Controllers/Signal";
import { FixedInstance } from "./Controllers/Fixed";
import { ConstantInstance } from "./Controllers/Constant";
import { ValueInstance } from "./Controllers/Value";
import { triggerProperty } from "./PropertiesTrigger";
import PropertySlot from "./PropertySlot";

export function syncProperty<T>(srcProperty: PropertySlot<T>,
                                dstProperty: PropertySlot<T>) {

    let src = srcProperty.controller;
    let dst = dstProperty.controller;

    let swap = false;
    if( dst.set === FCT_FALSE ) {
        if( src.set === FCT_FALSE )
            return false;

        swap = true;
    } else if(  src instanceof ValueInstance
             && dst instanceof SignalInstance)
            swap = true;

    if(swap) {
        const tmp = dst;
        dst = src ; src = tmp;
    }

    const dstSlots = dst.slots!; // should be defined.
    for(let i = 0; i < dstSlots.length; ++i)
        dstSlots[i].controller = src;

    const srcSlots = src.slots;

    if( srcSlots !== null) {
        let offset = srcSlots.length;
        srcSlots.length += dstSlots.length;
        for(let i = 0; i < dstSlots.length; ++i)
            srcSlots[offset++] = dstSlots[i];
    }
    
    let notify = true;

    // value is known.
    if(     !( dst instanceof SignalInstance)
        &&   ( src instanceof FixedInstance
            || src instanceof ConstantInstance
            || src instanceof ValueInstance
        )) {

        notify = src.get() !== dst.get();
    }

    if(notify)
        triggerProperty(dst, null);

    return true;
}