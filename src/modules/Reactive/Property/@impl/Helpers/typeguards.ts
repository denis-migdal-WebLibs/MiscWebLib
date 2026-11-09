import { Property, WritableProperty } from "../../@contract/@types/def";
import { ValueProperty } from "../Properties/ValueProperty";

export function isWritable<T>(obj: Property<T>): obj is WritableProperty<T> {
    return "set" in obj;
}

export function isValue<T>(obj: Property<T>): obj is ValueProperty<T> {
    return obj instanceof ValueProperty;
}