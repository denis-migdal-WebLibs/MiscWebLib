export type ValueProvider<T> = {
    get(): T;
    readonly isResolved: boolean
};

export type Property<T> = ValueProvider<T>;

export type ValueProperty<T> = Property<T> & {
    set(value: T): void;
}

export type ValuePropertyClass = {
    new<T>(initialValue: T): ValueProperty<T>

    // hooks...
    readonly onChange: <T>(this: ValueProperty<T>) => void;
}