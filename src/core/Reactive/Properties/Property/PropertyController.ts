import { PropertyNode } from "./PropertyNode";

export interface PropertyController<T> {

    get(): T;
    set(value: T, forceStamp?: Symbol): boolean;
    /**
     * Two equal stamps indicate an equal value.
     * - Value/Fixed/Computed : the value is returned (known).
     * - Signal : returns a Symbol that change after each assignation.
     * - View  : returns the target stamp.
     * 
     * Getting a stamp shouldn't require computations.
     */
    stamp?: any;

    // internal properties.
    readonly node: PropertyNode<T>;
    validate?: () => (true|{ validation: string, value: unknown });
}

export type PropertyDescriptor<CTX extends Record<string, any>, T>
        = (ctx: Readonly<CTX>, initialValue?: T) => PropertyController<T>

export function validate<T>(property: PropertyController<T>) {

    if( property.validate === undefined )
        return;

    const result = property.validate();
    if( result === true )
        return;

    throw new Error(`Validation "${result.validation}" failed on property (?): got ${JSON.stringify(result.value)}.`);
}
