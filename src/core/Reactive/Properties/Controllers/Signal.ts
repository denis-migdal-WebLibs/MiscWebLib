import { PropertyController } from "../Property/PropertyController";
import { createPropertyNode } from "../Property/PropertyNode";

export class SignalInstance<T> implements PropertyController<T>{

    protected value  : T;

    stamp = Symbol();

    constructor(initial: T) {
        this.value = initial;
    }

    get() {
        return this.value;
    }

    set(value: T, stamp = Symbol()) {
        this.stamp = stamp; // uniqueness guaranteed.
        this.value = value;
        return true;
    }

    readonly node = createPropertyNode<T>();
}

// Like Value() but always trigger a change.
export default function Signal<T>(defVal: T) {
    return (_: any, initialVal = defVal) => new SignalInstance(initialVal);
}