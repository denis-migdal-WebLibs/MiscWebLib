import { PropertyController } from "../Property";

export class ValueInstance<T> implements PropertyController<T>{

    protected value: T;

    constructor(initial: T) {
        this.value = initial;
    }

    get() { return this.value; }

    set(value: T) {

        if( this.value === value )
            return false;

        this.value = value;
        return true;
    }

    readonly slots = [];
}

export default function Value<T>(defVal: T) {
    return (_:any, initialVal = defVal) => new ValueInstance(initialVal);
}