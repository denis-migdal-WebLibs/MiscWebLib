import { PropertyController } from "../Property";

class ValueInstance<T> implements PropertyController<T>{

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

        if( this.value === value )
            return false;

        this.value = value;
        return true;
    }

    markStale(){}
}

export default function Value<T>(defVal: T) {
    return (_:any, initialVal = defVal) => new ValueInstance(initialVal);
}