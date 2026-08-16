import { NO_VALUE } from "MWL@2026/core/types";
import { RWPropertyController } from "../Property/PropertyController";

export class SignalController<T> implements RWPropertyController<T>{

    protected value  : T;

    constructor(initial: T) {
        this.value = initial;
    }

    get() {
        return this.value;
    }

    set(value: T) {
        this.value = value;
    }

    isChange() {
        return true;
    }

    clearValue() {
        this.value = NO_VALUE;
    }
}

// Like Value() but always trigger a change.
export function Signal<T>(defVal: T) {
    return (initialVal = defVal) => new SignalController(initialVal);
}