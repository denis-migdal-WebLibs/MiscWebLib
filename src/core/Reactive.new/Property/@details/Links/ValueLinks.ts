import { addLink, requestReaction } from "MWL@2026/core/Reactive.new/Reaction";
import { MutableProperty, ValueProperty, ValueProvider } from "../../@contract";
import { isValue } from "../Properties/ValueProperty";

export function linkValue<T>(src: MutableProperty<T>, dst: ValueProperty<T>) {
    return addLink(src, dst, () => {

        let srcSource: ValueProvider<T> = src;
        if( isValue(src) ) // opti
            srcSource = src.source;

        dst._setSource( srcSource )
    });
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