export type DefineExtensionsFcts<
                    T extends Record<string, any>,
                    Args extends any[],
                > = {
    [K in keyof T]: (...args: Args) => T[K]
}

export type DefineExtensionsModule<
                    Exts extends Record<string, any>
                > = {
    [K in keyof Exts as K extends string ? `${K}Extension` : never]: Exts[K]
}
