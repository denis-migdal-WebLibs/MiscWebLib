import { NO_VALUE } from "MWL@2026/core/types";
import { RWPropertyController } from "../Property/PropertyController";

export class ValueController<T> implements RWPropertyController<T>{

    protected value: T;

    constructor(initial: T) {
        this.value = initial;
    }

    get() { return this.value; }

    set(value: T) {
        this.value = value;
    }

    isChange(newVal: T) {
        return newVal !== this.value;
    }

    clearValue() {
        this.value = NO_VALUE;
    }
}

export function Value<T>(defVal: T) {
    return (initialVal = defVal) => new ValueController(initialVal);
}