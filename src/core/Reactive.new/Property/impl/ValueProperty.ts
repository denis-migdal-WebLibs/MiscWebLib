import { NO_VALUE } from "MWL@2026/core/types";
import { ValueProvider, ValueProperty, ReactiveValueProperty } from "../contract/index2";
import { ReactiveObject, requestReaction } from "../../Scheduler";
import { Link } from "../../Scheduler/contract";

export class ReactiveValue<T> extends ReactiveObject<Link>
                            implements ReactiveValueProperty<T> {

    private _ctrler;

    constructor(initialValue: T) {
        //TODO...
        super((l) => {
            this._ctrler.setSource(l.data);
        });

        this._ctrler = new ValuePropertyImpl(initialValue);
    }

    get() {
        return this._ctrler.get();
    }

    set(value: T) {

        // should not cause issues.
        if( this._ctrler.isResolved && this._ctrler.get() === value )
            return;
        
        this._ctrler.set(value);
        requestReaction(this);
    }

    // for compat', dunno if really useful.
    get isResolved() {
        return this._ctrler.isResolved;
    }
}

export class ValuePropertyImpl<T> implements ValueProperty<T> {

    protected value: T;
    protected selfSource: ValueProvider<T> = {
                        get: () => this.value,
                        isResolved: true
                    };

    source = this.selfSource;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    get() {
        //TODO: infinite loop...
        return this.source.get();
    }

    set(value: T) {
        this.source = this.selfSource;
        this.value  = value;
    }

    get isResolved() {
        return this.source.isResolved === true;
    }

    setSource(source: ValueProvider<T>) {
        this.source = source;
        this.value  = NO_VALUE;
    }
}