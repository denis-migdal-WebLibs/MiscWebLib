import { PropertyController } from "../Property/PropertyController";

export class FixedInstance<T> extends PropertyController<T>{

    protected value  : T;

    constructor(initial: T) {
        super();
        this.value = initial;
    }

    get() { return this.value; }
}

export function Fixed<T>(defVal: T) {
    return (_: object, initialVal = defVal) => new FixedInstance(initialVal);
}