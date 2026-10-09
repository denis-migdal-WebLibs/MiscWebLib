import { ReactiveObject } from "MWL@2026/core/Reactive.new/Reaction";
import { ImmutableProperty } from "../../@contract";

export class ImmutablePropertyImpl<T> extends    ReactiveObject
                                      implements ImmutableProperty<T>
                                    {

    //readonly valueProvider: ValueProvider<T> = this;
    readonly isResolved = true;

    protected readonly value;
    constructor(value: T) {
        super();
        this.value = value;
    }

    get() { return this.value; }

}

export function Constant<T>(value: T) {
    return () => new ImmutablePropertyImpl(value);
}
export function Fixed<T>(defVal: T) {
    return (initialVal = defVal) => new ImmutablePropertyImpl(initialVal);
}