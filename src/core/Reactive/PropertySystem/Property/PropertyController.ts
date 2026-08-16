import { Property } from "./Property";
import { PropertyValue } from "./PropertyValue";

export type PropertyController<T> = ImmutablePropertyController<T>
                                   |DerivedPropertyController<T>
                                   |RWPropertyController<T>;

export interface ImmutablePropertyController<T> extends PropertyValue<T> {}
export interface DerivedPropertyController<T> extends PropertyValue<T> {
    readonly dependencies: Property<any>[];
    clearValue(): void;
}
export interface RWPropertyController<T> extends PropertyValue<T> {
    set(value: T): void;
    clearValue(): void;

    isChange(newVal: T): boolean;
}