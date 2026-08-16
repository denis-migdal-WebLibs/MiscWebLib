import { ImmutablePropertyController } from "../Property/PropertyController";

export class ConstantController<T> implements ImmutablePropertyController<T> {

    readonly value;

    constructor(value: T) {
        this.value = value;
    }

    get() {
        return this.value;
    }
}

export function Constant<T>(value: T) {
    return () => new ConstantController(value);
}