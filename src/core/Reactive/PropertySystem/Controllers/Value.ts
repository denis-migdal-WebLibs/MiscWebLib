import { RWPropertyController } from "../Property/PropertyController";

export class ValueController<T> implements RWPropertyController<T>{

    protected value: T;

    readonly defaultValue: T;

    constructor(defaultValue: T) {
        this.value = this.defaultValue = defaultValue;
    }

    get() { return this.value; }

    set(value: T) {
        this.value = value;
    }

    isChange(newVal: T) {
        return newVal !== this.value;
    }

    clearValue() {
        this.value = this.defaultValue;
    }
}

export function Value<T>(defVal: T) {
    return (defaultVal = defVal) => new ValueController(defaultVal);
}