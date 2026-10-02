import { Link, ReactiveObject } from "../../Scheduler/@contract";

export type ValueProvider<T> = { get(): T };

export type PropertyLink<T> = Link & ValueProvider<T>;

export type ImmutablePropertyController<T> = ValueProvider<T> & {
    set?: never;
};
export type RWPropertyController<T> = ValueProvider<T> & {
    set(value: T): void;
    isSameValue(value: T): boolean;
    clearValue(): void;
}
/*
    export interface DerivedPropertyController<T> extends PropertyValue<T> {
        readonly dependencies: Property<any>[];
        clearValue(): void;
    }
*/

//TODO: several types ?
export type PropertyController<T> = ImmutablePropertyController<T>
                                   |RWPropertyController<T>;

export type Property<
                        T, 
                        IsRO extends boolean = boolean
                    > = ReactiveObject<PropertyLink<T>> & {
        get(): T;
        set(value: IsRO extends false ? T : never): void;
        readonly isRO: IsRO;
    }

export type InferCtrlerValueType<Ctrler>
                    = Ctrler extends PropertyController<infer T> ? T : never;

export type IsCtrlerRO<Ctrler> = Ctrler extends RWPropertyController<any>
                                ? false : true;

export type InferPropertyFromCtrler<Ctrler extends PropertyController<any>>
                = Property<InferCtrlerValueType<Ctrler>, IsCtrlerRO<Ctrler> >;

export type PropertyClass = {
            new<
                Ctrler extends PropertyController<any>,
            >(controller: Ctrler): InferPropertyFromCtrler<Ctrler>
        };