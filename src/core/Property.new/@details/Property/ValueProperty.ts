import { NO_VALUE, NULL_OP } from "MWL@2026/core/types";
import { ValueProperty, ValueProvider } from "../../@contract";

export class ValuePropertyImpl<T> implements ValueProperty<T> {

    protected readonly selfSource: ValueProvider<T> = {
                        get: () => this.value,
                        isResolved: true
                    };

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    protected value: T;
    protected source = this.selfSource;

    //TODO: hide ???
    setSource(source: ValueProvider<T>) {
        this.source = source;
        this.value  = NO_VALUE;

        callHook(this, "onChange");
    }

    get() { return this.source.get(); }
    set(value: T) {
        this.source = this.selfSource;
        this.value  = value;

        callHook(this, "onChange");
    }

    static onChange = NULL_OP;

    get isResolved() {
        return this.source.isResolved === true;
    }
}

function callHook(o: {}, name: string) {
    const klass = o.constructor as Record<string, any>;

    __ASSERT__(name in klass, `Hook ${name} not found`);

    return (klass[name] as Function).call(o);
}