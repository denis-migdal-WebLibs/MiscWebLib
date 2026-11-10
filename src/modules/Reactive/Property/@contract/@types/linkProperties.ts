import { Property } from "./def";
import { InferRWValues, InferValues } from "./PropertiesRecord";

type CompatibleDstKeys<T, U extends Record<string, any>> = {
  [K in keyof U]: T extends U[K] ? K : never;
}[keyof U];

type FMAP<T extends Record<string, any>, U extends Record<string, any>> = {
  [K in keyof T]: readonly [K, CompatibleDstKeys<T[K], U>]
}[keyof T];

type CompatibleKeys<T, U extends Record<string, any>> = {
  [K in keyof U]: T extends U[K] ? U[K] extends T ? K
                                                  : never
                                 : never;
}[keyof U];

type SMAP<T extends Record<string, any>, U extends Record<string, any>> = {
  [K in keyof T]: readonly [K, CompatibleKeys<T[K], U>]
}[keyof T];

export type ForwardMap<
                    T extends Record<string, Property<any>>,
                    U extends Record<string, Property<any>>,
                > = readonly FMAP<InferValues<T>, InferRWValues<U>>[];

export type SyncMap<
                    T extends Record<string, Property<any>>,
                    U extends Record<string, Property<any>>,
                > = readonly SMAP<InferRWValues<T>, InferRWValues<U>>[];