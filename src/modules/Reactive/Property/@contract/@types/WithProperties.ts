import { Property } from "./def";
import { InferValues, PropertiesRecord } from "./PropertiesRecord";

export const PROPERTIES = Symbol();

export type WithProperties<T extends Record<string, Property<any>>> = {
    readonly [PROPERTIES]: PropertiesRecord<T>
}

export type PropertiesShape<T extends WithProperties<any>> = T extends WithProperties<infer U> ? InferValues<U> : never;