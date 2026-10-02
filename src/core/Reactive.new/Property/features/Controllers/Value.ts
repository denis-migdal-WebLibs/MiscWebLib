import { NO_VALUE } from "MWL@2026/core/types";
import { RWPropertyController } from "../../contract";

export class ValueController<T> implements RWPropertyController<T>{

    protected value: T;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    get() { return this.value; }

    set(value: T) {
        this.value = value;
    }

    isSameValue(value: T) {
        return this.value === value;
    }

    clearValue() {
        // h4ck
        this.value = NO_VALUE;
    }
}

export function Value<T>(defVal: T) {
    return (initialValue = defVal) => new ValueController(initialValue);
}