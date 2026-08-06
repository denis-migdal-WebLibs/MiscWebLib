import { PropertyController } from "../Property/PropertyController";

export class ValueInstance<T> extends PropertyController<T>{

    protected value: T;

    constructor(initial: T) {
        super();
        this.value = initial;
    }

    get() { return this.value; }

    override set(value: T) {

        if( this.value === value )
            return false;

        this.value = value;
        return true;
    }
}

export function Value<T>(defVal: T) {
    return (_:any, initialVal = defVal) => new ValueInstance(initialVal);
}