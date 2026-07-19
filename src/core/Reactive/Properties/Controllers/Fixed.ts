import { FCT_FALSE } from "MWL@2026:core/types";

import { PropertyController } from "../Property";

export class FixedInstance<T> implements PropertyController<T>{

    protected value  : T;

    constructor(initial: T) {
        this.value = initial;
    }

    get() { return this.value; }

    declare set      : typeof FCT_FALSE;

    static {
        this.prototype.set       = FCT_FALSE;
    }
}

export default function Fixed<T>(defVal: T) {
    return (_: object, initialVal = defVal) => new FixedInstance(initialVal);
}