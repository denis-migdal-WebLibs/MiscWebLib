import { ImmutablePropertyController } from "../Property/PropertyController";

export class FixedController<T> implements ImmutablePropertyController<T>{

    protected value  : T;

    constructor(initial: T) {
        this.value = initial;
    }

    get() { return this.value; }
}

export function Fixed<T>(defVal: T) {
    return (initialVal = defVal) => new FixedController(initialVal);
}