import { Property } from "./def";
import { PropertiesRecord } from "./PropertiesRecord";

export const PROPERTIES = Symbol();

export type WithProperties<T extends Record<string, Property<any>>> = {
    readonly [PROPERTIES]: PropertiesRecord<T>
}