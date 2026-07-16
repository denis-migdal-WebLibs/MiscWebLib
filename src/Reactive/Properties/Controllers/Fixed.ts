import { FCT_FALSE, NULL_OP } from "MWL@2026:types";

import { PropertyController } from "../Property";

class FixedInstance<T> implements PropertyController<T>{

    protected value  : T;

    constructor(initial: T) {
        this.value = initial;
    }

    get() { return this.value; }

    declare set      : typeof FCT_FALSE;
    declare markStale: typeof NULL_OP;

    static {
        this.prototype.set       = FCT_FALSE;
        this.prototype.markStale = NULL_OP;
    }
}

export default function Fixed<T>(defVal: T) {
    return (_: object, initialVal = defVal) => new FixedInstance(initialVal);
}