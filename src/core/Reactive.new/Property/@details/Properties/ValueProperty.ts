import { NO_VALUE } from "MWL@2026/core/types";
import { ReactiveObject, requestReaction } from "MWL@2026/core/Reactive.new/Reaction";
import { Property, ValueProperty, ValueProvider, WritableProperty } from "../../@contract";

export class ValuePropertyImpl<T> extends ReactiveObject
                               implements ValueProperty<T> {

    protected value: T;
    protected selfSource: ValueProvider<T> = {
                        get: () => this.value,
                        isResolved: true
                    };

    constructor(initialValue: T) {
        super();
        this.value = initialValue;
    }

    source = this.selfSource;
    get() { return this.source.get(); }
    set(value: T) {

        // should not cause issues (I guess ?).
        if( this.isResolved && this.get() === value )
            return;

        this.source = this.selfSource;
        this.value  = value;

        requestReaction(this);
    }

    get isResolved() {
        return this.source.isResolved === true;
    }

    // internal: used by Links...
    _setSource(source: ValueProvider<T>) {
        this.source = source;
        this.value  = NO_VALUE;
    }
}

export function Value<T>(defVal: T) {
    return (defaultVal = defVal) => new ValuePropertyImpl(defaultVal);
}

export function isWritable<T>(obj: Property<T>): obj is WritableProperty<T> {
    return "set" in obj;
}

export function isValue(obj: {}): obj is ValueProperty<any> {
    return obj instanceof ValuePropertyImpl;
}