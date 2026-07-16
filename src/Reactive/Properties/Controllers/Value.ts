import { NULL_OP } from "MWL@2026:types";
import { PropertyController } from "../Property";

class ValueInstance<T> implements PropertyController<T>{

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

    declare markStale: typeof NULL_OP;
    static {
        this.prototype.markStale = NULL_OP;
    }
}

export default function Value<T>(defVal: T) {
    return (_:any, initialVal = defVal) => new ValueInstance(initialVal);
}