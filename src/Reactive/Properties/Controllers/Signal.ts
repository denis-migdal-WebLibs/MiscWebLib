import { PropertyController } from "../Property";
import { NULL_OP } from "MWL@2026:types";

class SignalInstance<T> implements PropertyController<T>{

    protected value  : T;

    stamp = 0;

    constructor(initial: T) {
        this.value = initial;
    }

    get() {
        return this.value;
    }

    set(value: T) {
        ++this.stamp;
        this.value = value;
        return true;
    }

    declare markStale: typeof NULL_OP;
    static {
        this.prototype.markStale = NULL_OP;
    }
}

// Like Value() but always trigger a change.
export default function Signal<T>(defVal: T) {
    return (_: any, initialVal = defVal) => new SignalInstance(initialVal);
}