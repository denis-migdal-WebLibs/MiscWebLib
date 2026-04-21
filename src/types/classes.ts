// default T needs to be object, not any.
// else adds [key: string]: any in mixins classes.
// https://www.typescriptlang.org/docs/handbook/mixins.html
// default parameters is never[], enables safe storage and extensions.
export type Cstr<T    extends object    = object,
                 ARGS extends unknown[] = never[]
            > = {new(...args: ARGS): T};

export type Constructible<
                              T    extends object    = object,
                              Args extends unknown[] = never[]
                    > = Cstr<T, Args> | ((...args: Args) => T);

// Checks whether an object is a class.
export function isClass<T    extends object    = object,
                        ARGS extends unknown[] = never[]>(
                            obj: Constructible<T, ARGS>|unknown
                        ): obj is Cstr<T, ARGS> {
    const prototype = Object.getOwnPropertyDescriptor(obj, "prototype");
    if( prototype === undefined)
        return false;
    return prototype.writable === false;
}