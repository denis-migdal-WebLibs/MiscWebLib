import { Link } from "MWL@2026/modules/Reactive/Reaction";
import { ImmutableProperty, ImmutablePropertyClass, MutableProperty, Property, ValueProperty, ValuePropertyClass, ComputedPropertyClass, WritableProperty } from "./@types/def";
import { InferValues, PropertiesRecordClass } from "./@types/PropertiesRecord";
import { WithProperties } from "./@types/WithProperties";
import { ForwardMap, SyncMap } from "./@types/linkProperties";

export interface PropertyDetails {

    // Properties
    ImmutableProperty: ImmutablePropertyClass;
    ValueProperty    : ValuePropertyClass;
    ComputedProperty : ComputedPropertyClass;

    // properties record
    PropertiesRecord : PropertiesRecordClass;

    getProperties<T extends Record<string, Property<any>>>(
            target: WithProperties<T>,
        ): ReadonlyArray<Property<unknown>>;

    getPropertiesKeys<T extends Record<string, Property<any>>>(
            target: WithProperties<T>,
        ): ReadonlyArray<string>;

    updateProperties<T extends Record<string, Property<any>>>(
            target: WithProperties<T>,
            values: Partial<Readonly<InferValues<NoInfer<T>>>>
        ): void;

    forwardProperties<
                        T extends Record<string, Property<any>>,
                        U extends Record<string, Property<any>>
                    >(
                        src: WithProperties<T>,
                        dst: WithProperties<U>,
                        mappings: ForwardMap<NoInfer<T>,NoInfer<U>>
                        // ^ required to prevent bad surprises.
                    ): void;
    
    syncProperties<
                        T extends Record<string, Property<any>>,
                        U extends Record<string, Property<any>>
                    >(
                        src: WithProperties<T>,
                        dst: WithProperties<U>,
                        mappings: SyncMap<NoInfer<T>,NoInfer<U>>
                        // ^ required to prevent bad surprises.
                    ): void;

    // factories
    Value   <T>(defVal: T): () => ValueProperty<T>;
    Constant<T>(value : T): () => ImmutableProperty<T>;
    Fixed   <T>(defVal: T): (initialValue?: T) => ImmutableProperty<T>;

    // type guards
    isWritable<T>(obj: Property<T>): obj is WritableProperty<T>;
    isValue   <T>(obj: Property<T>): obj is ValueProperty<T>;

    // links

    // Currently, we can't recognize a Mutable from an Immutable property.
    // Therefore an isMutable() isn't currently possible.
    //
    // Note: should have a version for Writable, but not for now.
    linkValue   <T>(src: MutableProperty<T>, dst: ValueProperty<T>): Link;
    forwardValue<T>(src: MutableProperty<T>, dst: ValueProperty<T>): void;
    syncValue   <T>(src: ValueProperty<T>  , dst: ValueProperty<T>): void;
}

export interface PropertyImpl extends PropertyDetails {}

export interface PropertyContract
                    extends PropertyDetails {}