import { FCT_FALSE } from "MWL@2026:core/types";
import { PropertyController } from "../Property";

export class ConstantInstance<T> implements PropertyController<T> {

    readonly value;

    constructor(value: T) {
        this.value = value;
    }

    get() {
        return this.value;
    }

    declare set: typeof FCT_FALSE;
    static {
        this.prototype.set = FCT_FALSE;
    }
}

export default function Constant<T>(value: T) {
    return () => new ConstantInstance(value);
}