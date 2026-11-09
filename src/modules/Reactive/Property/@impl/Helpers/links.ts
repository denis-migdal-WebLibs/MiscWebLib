import { addLink, requestReaction } from "MWL@2026/modules/Reactive/Reaction";
import { MutableProperty, ValueProperty } from "../../@contract/@types/def";
import { isValue } from "./typeguards";

export function linkValue<T>(src: MutableProperty<T>, dst: ValueProperty<T>) {

    if( isValue(src) ) // opti
        return addLink(src, dst, () => dst._setSource( src.source ) );

    return addLink(src, dst, () => dst._setSource( src ) );
}

export function forwardValue<T>(
                                src: MutableProperty<T>,
                                dst: ValueProperty<T>
                            ) {

    const link = linkValue(src, dst);
    requestReaction(dst, link);
}

export function syncValue<T>(
                                src: ValueProperty<T>,
                                dst: ValueProperty<T>
                            ) {
    
    const link = linkValue(src, dst);
    linkValue(dst, src);

    requestReaction(dst, link);
}