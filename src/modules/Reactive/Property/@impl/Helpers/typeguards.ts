import { Property, WritableProperty } from "../../@contract/@types/def";
import { ValueProperty } from "../Properties/ValueProperty";
// TODO: due to TS bug : https://github.com/microsoft/TypeScript/issues/65389
import { ValueProperty as ValuePropertyType} from "../../@contract/@types/def";

export function isWritable<T>(obj: Property<T>): obj is WritableProperty<T> {
    return "set" in obj;
}

export function isValue<T>(obj: Property<T>): obj is ValuePropertyType<T> {
    return obj instanceof ValueProperty;
}