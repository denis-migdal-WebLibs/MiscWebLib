import { PropertyController } from "../Property";

class SignalInstance<T> implements PropertyController<T>{

    // keep it if we want to "reset" somehow.
    protected initial: T;
    protected value  : T;

    constructor(initial: T) {
        this.value = this.initial = initial;
    }

    get() {
        return this.value;
    }

    set(value: T) {
        this.value = value;
        return true;
    }

    markStale(){}
}

// Like Value() but always trigger a change.
export default function Signal<T>(defVal: T) {
    return (_: any, initialVal = defVal) => new SignalInstance(initialVal);
}