import { Property } from "../../@contract";

export class ImmutableProperty<T> implements Property<T> {

    readonly isResolved = true;

    constructor(value: T) {
        this.value = value;
    }

    protected readonly value;
    get() { return this.value; }
}

/*
export function Constant<T>(value: T) {
    return () => new ImmutablePropertyImpl(value);
}
export function Fixed<T>(defVal: T) {
    return (initialVal = defVal) => new ImmutablePropertyImpl(initialVal);
}
*/