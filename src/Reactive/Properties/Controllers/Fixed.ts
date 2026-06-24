import { FCT_FALSE, NULL_OP } from "MWL@2026:types";

import { PropertyController } from "../Property";

class FixedInstance<T> implements PropertyController<T>{

    // keep it if we want to "reset" somehow.
    protected initial: T;
    protected value  : T;

    constructor(initial: T) {
        this.value = this.initial = initial;
    }

    get() { return this.value; }

    readonly set       = FCT_FALSE;
    readonly markStale = NULL_OP;
}

export default function Fixed<T>(defVal: T) {
    return (_:any, initialVal = defVal) => new FixedInstance(initialVal);
}