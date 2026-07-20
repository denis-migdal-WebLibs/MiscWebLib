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

    declare set  : typeof FCT_FALSE;
    declare slots: null;
    static {
        this.prototype.set   = FCT_FALSE;
        this.prototype.slots = null;
    }
}

export default function Constant<T>(value: T) {
    return () => new ConstantInstance(value);
}