import { FCT_FALSE } from "MWL@2026:types";
import { PROPERTY_NODE, PropertyController } from "./Property";
import { SignalInstance } from "./Controllers/Signal";
import { FixedInstance } from "./Controllers/Fixed";
import { ConstantInstance } from "./Controllers/Constant";
import { ValueInstance } from "./Controllers/Value";
import { triggerProperty } from "./PropertiesTrigger";

export function syncProperty<T>(src: PropertyController<T>,
                                dst: PropertyController<T>) {

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

    const dstHolders = dst[PROPERTY_NODE]!.holders; // should be defined.
    for(let i = 0; i < dstHolders.length; ++i)
        dstHolders[i].property = src;

    const srcNode = src[PROPERTY_NODE];

    // if undefined, they are fixed or constant.
    if( srcNode !== undefined) {

        const dstNode = dst[PROPERTY_NODE]!;

        addUnique(srcNode.holders     , dstNode.holders);
        addUnique(srcNode.resolvedHost, dstNode.resolvedHost);
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

function addUnique<T>(target: T[], elements: readonly T[]) {

    let offset = target.length;
    target.length += elements.length;
    for(let i = 0; i < elements.length; ++i)
        if( ! target.includes(elements[i]) )
            target[offset++] = elements[i];

    target.length = offset;
}