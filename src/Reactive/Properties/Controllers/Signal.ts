import { PropertyController } from "../Property";

export class SignalInstance<T> implements PropertyController<T>{

    protected value  : T;

    stamp = Symbol();

    constructor(initial: T) {
        this.value = initial;
    }

    get() {
        return this.value;
    }

    set(value: T) {
        this.stamp = Symbol(); // uniqueness guaranteed.
        this.value = value;
        return true;
    }
}

// Like Value() but always trigger a change.
export default function Signal<T>(defVal: T) {
    return (_: any, initialVal = defVal) => new SignalInstance(initialVal);
}