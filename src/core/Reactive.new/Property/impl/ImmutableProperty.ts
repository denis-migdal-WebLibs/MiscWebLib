import { ValueProvider } from "../contract";
import { ImmutableProperty } from "../contract/index2";

export class ImmutablePropertyImpl<T> implements ImmutableProperty<T> {

    protected readonly value;
    readonly valueProvider: ValueProvider<T> = this;

    constructor(value: T) {
        this.value = value;
    }

    get() {
        return this.value;
    }

    readonly isResolved = true;
}

export function Constant<T>(value: T) {
    return () => new ImmutablePropertyImpl(value);
}
export function Fixed<T>(defVal: T) {
    return (initialVal = defVal) => new ImmutablePropertyImpl(initialVal);
}