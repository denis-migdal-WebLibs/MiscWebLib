import { NO_VALUE } from "MWL@2026/core/types";
import { ReactiveObject, requestReaction } from "MWL@2026/modules/Reactive/Reaction";
import { PropertyDetails } from "../../@contract";
import type {ValueProperty, ValueProvider} from "../../@contract/@types/def";

const ValueProperty: PropertyDetails["ValueProperty"]
    = class <T> extends ReactiveObject
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

export {ValueProperty};