export interface PropertyController<T> {
    get(): T;
    set(value: T|undefined): boolean;
    markStale(): void;
    validate?: () => true|{ validation: string, value: unknown };
}

export type PropertiesControllers<T extends Record<string, any>> = {
    [K in keyof T]: PropertyController<T[K]>
}

export type PropertyDescriptor<CTX extends Record<string, any>, T>
        = (ctx: Readonly<CTX>) => PropertyController<T>

export type PropertiesDescriptors<T extends Record<string, any>> = {
    [K in keyof T]: PropertyDescriptor<T, T[K]>
}

export type GetPropertiesType<T extends PropertiesDescriptors<any>>
    = T extends PropertiesDescriptors<infer U> ? U : never;