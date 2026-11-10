// We need it to be in Reactive/Property as it is required by View()

import { InferValueType, Property, ValueProperty } from "./def";

const T = Symbol();

// Be careful, properties are fixed.
export type PropertiesRecord<out T extends Record<string, Property<any>>> = {

    get    <K extends Extract<keyof T, string>>(name: K): T[K];
    resolve<K extends Extract<keyof T, string>>(name: K): T[K];

    getByIdx<V extends T[keyof T]>(idx: number): V;

    //readonly descriptors: PropertiesDescriptors<T>;
    // ^ this make it incompatible with <out T>.
    readonly [T]?: T;
    // ^ required if we want to be able to infer <T>

    // opti shortcuts
    readonly keys      : readonly string[];
    readonly properties: readonly Property<unknown>[];
}

export type PropertiesRecordClass = {
    new<T extends Record<string, Property<any>>>(

        descriptors   : PropertiesDescriptors<T>,
        initialValues?: Partial<InferValues<NoInfer<T>>>

    ): PropertiesRecord<T>
}

export type PropertiesDescriptors<T extends Record<string, Property<any>>> = {
    [K in keyof T]: (this: PropertiesRecord<T>, initialValue?: InferValueType<T[K]>) => T[K]
}

/*
export type InferValues<T extends Record<string, Property<any>>> = {
    [K in keyof T]: InferValueType<T[K]>;
}
*/
export type InferRWValues<T extends Record<string, Property<any>>> = {
    [K in keyof T as T[K] extends ValueProperty<any>
                            ? K
                            : never
                    ]: InferValueType<T[K]>;
}

export type InferValues<T extends Record<string, Property<any>>>
    = InferRWValues<T>
    & { readonly [K in keyof T]: InferValueType<T[K]>; };

// From Record<string, any>

export type PropertiesFor<T extends Record<string, any>>
    = {
        [K in keyof T]: Property<T[K]>
    }

export type PropertiesRecordFor<T extends Record<string, any>>
    = PropertiesRecord<PropertiesFor<T>>;

export type PropertiesDescriptorsFor<T extends Record<string, any>>
    = PropertiesDescriptors<PropertiesFor<T>>