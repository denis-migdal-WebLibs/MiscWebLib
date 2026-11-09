import { PropertiesRecordFor } from "../../@contract/@types/PropertiesRecord";
import { ComputedProperty } from "../Properties/ComputedProperty";
import { ImmutableProperty } from "../Properties/ImmutableProperty";
import { ValueProperty } from "../Properties/ValueProperty";
import { Property } from "../../@contract/@types/def";

export function Value<T>(defVal: T) {
    return (defaultVal = defVal) => new ValueProperty(defaultVal);
}

export function Constant<T>(value: T) {
    return () => new ImmutableProperty(value);
}
export function Fixed<T>(defVal: T) {
    return (initialVal = defVal) => new ImmutableProperty(initialVal);
}

//TODO: move ?
export type FromEntries<
    K extends string[],
    V extends    any[]
> = {
    [I in Exclude<keyof K, keyof any[]> as Extract<K[I], string>]: V[I & keyof V];
}

export function Computed<
                    T,
                    const Keys   extends string[],
                    const Values extends any   [],
                >(
            keys    : Keys,
            compute : (...args: Values) => T,
            //converter: Cstr<ViewConverter<T, Sources>>|ConvertFct<T, Sources>
        ) {

    const values = new Array<unknown>(keys.length) as Values;

    return function (this: PropertiesRecordFor<FromEntries<Keys, Values>>) {

        const sources = new Array<Property<unknown>>(keys.length);
        for(let i = 0; i < keys.length; ++i)
            // @ts-expect-error
            sources[i] = this.resolve(keys[i]); // ensure init.

        const fct = () => {
            for(let i = 0; i < sources.length; ++i)
                values[i] = sources[i].get();

            return compute(...values);
        }
        /*
        const transform = getConversionFct(converter);
        */

        return new ComputedProperty(sources, fct);
    };   
}


//////
// Factory
//////

/*
type ViewConverter<T, Sources extends any[]> = {
    convert(...sources: Sources): T
};
type ConvertFct<T, Sources extends any[]> = ((...sources: Sources) => T);

type ConvertArg<
                    T,
                    Sources extends any[]
                > = Cstr<ViewConverter<T, Sources>>|ConvertFct<T, Sources>;

//TODO: more complex...
function getConversionFct<
                    T,
                    Sources extends ReactiveObject[]
                >(converter: ConvertArg<T, Sources>): ConvertFct<T, Sources> {

    if( ! isClass(converter) )
        return converter;

    const instance = new converter();
    return (...args) => instance.convert(...args);    
}

*/