import { ObservableObject } from "MWL@2026/core/Observable";
import { MutableProperty, Property } from "MWL@2026/core/Reactive.new/Property/@contract";
import { ReactiveObject } from "MWL@2026/core/Reactive.new/Reaction";

export type Properties<T extends Record<string, any>> = T
    // TODO: PropertiesRecord
    // Careful (assignability)
    & ReactiveObject
    & ObservableObject;

export type InferPropertiesShape<T> = T extends Properties<infer U>
                                        ? U
                                        : never;

export type PropertiesFactory = <
                                    Desc extends PropertiesDescriptors<any>,
                                    T    extends InferProperties<Desc>
                                >(
                                    descriptors   : Desc,
                                    initialValues?: Partial<T>
                                ) => Properties<T>;

/////
// Descriptors (REMOVE - NOT HERE)
/////

//todo: XXXX (deps provider in this...) - for View...
export type PDescriptor<T> = (initialValue?: T) => Property<T>
export type PropertiesDescriptors<T extends Record<string, any>> = {
    //TODO: <T, T[K]>
    [K in keyof T]: PDescriptor<T[K]>
}

export type InferProperties<T extends PropertiesDescriptors<any>> = {
    [K in keyof T as ReturnType<T[K]> extends MutableProperty<any>
                            ? K
                            : never
                    ]: T[K] extends PDescriptor<infer U>
                        ? U
                        : never;
} & {
    readonly [K in keyof T]: T[K] extends PDescriptor<infer U> ? U : never;
};
