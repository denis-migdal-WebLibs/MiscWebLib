import { PropertyController } from "../Property/PropertyController";

export class ConstantInstance<T> extends PropertyController<T> {

    readonly value;

    constructor(value: T) {
        super();
        this.value = value;
    }

    get() {
        return this.value;
    }
}

export default function Constant<T>(value: T) {
    return () => new ConstantInstance(value);
}