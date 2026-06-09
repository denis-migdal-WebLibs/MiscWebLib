export interface Property<T> {
    get(): T;
    set(value: T|undefined): boolean;
    markStale(): void;
    validate?: () => true|{ validation: string, value: unknown };
}

export type PropertyBuilder<CTX extends Record<string, any>, T>
        = (ctx: Readonly<CTX>) => Property<T>

export type Descriptors<T extends Record<string, any>> = {
    [K in keyof T]: PropertyBuilder<T, T[K]>
}

export type Properties<T extends Record<string, any>> = {
    [K in keyof T]: Property<T[K]>
}