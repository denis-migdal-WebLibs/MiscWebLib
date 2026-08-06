import { PropertyController } from "../Property/PropertyController";

export class SignalInstance<T> extends PropertyController<T>{

    protected value  : T;
    protected _stamp = Symbol();

    constructor(initial: T) {
        super();
        this.value = initial;
    }

    get() {
        return this.value;
    }

    override set(value: T, stamp = Symbol()) {
        this._stamp = stamp; // uniqueness guaranteed.
        this.value = value;
        return true;
    }

    override get stamp() {
        return this._stamp;
    }
}

// Like Value() but always trigger a change.
export default function Signal<T>(defVal: T) {
    return (_: any, initialVal = defVal) => new SignalInstance(initialVal);
}