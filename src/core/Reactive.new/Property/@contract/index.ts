import { ReactiveObject } from "../../Reaction";

export type ValueProvider<T> = { get(): T; readonly isResolved: boolean };
export type InferValueType<V extends ValueProvider<any>> = V extends ValueProvider<infer U> ? U : never;

// All Property are reactives to simplify code.
export type Property<T> = ValueProvider<T> & ReactiveObject;

export type ImmutableProperty<T> = Property<T>;
export type ImmutablePropertyClass = {
    new <T>(value: T): ImmutableProperty<T>
}

export type MutableProperty<T> = Property<T>;
export type WritableProperty<T> = MutableProperty<T> & {
    set(value: T): void;
}

// Value
export type ValueProperty<T> = WritableProperty<T>
    & {
        readonly source: ValueProvider<T>

        // used by links
        _setSource(source: ValueProvider<T>): void;
    }

export type ValuePropertyClass = {
    new <T>(value: T): ValueProperty<T>
}

// View
export type ViewProperty<T> = MutableProperty<T>
    & {
    }

export type ViewPropertyClass = {
    new <T>(): ViewProperty<T>
}