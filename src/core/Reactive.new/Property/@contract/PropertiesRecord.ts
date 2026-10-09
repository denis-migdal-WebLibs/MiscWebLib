// We need it to be here as it is required by View()

import { InferValueType, Property } from ".";

// Be careful, properties are fixed.
export type PropertiesRecord<T extends Record<string, Property<any>>> = {

    get<K extends keyof T>(name: K): T[K];
    resolve<K extends keyof T>(name: K): T[K];

    readonly descriptors: PropertiesDescriptors<T>;

    // opti shortcuts
    readonly names     : readonly (keyof T)[];
    readonly properties: readonly T[keyof T][];
}

//TODO: this type...
export type PropertiesDescriptors<T extends Record<string, Property<any>>> = {
    [K in keyof T]: (initialValue?: T) => T[K]
}

export type InferValues<T extends Record<string, Property<any>>> = {
    [K in keyof T]: InferValueType<T[K]>;
}