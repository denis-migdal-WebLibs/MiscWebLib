import { PropertiesRecordFor } from "../../@contract/@types/PropertiesRecord";
import { ComputedProperty } from "../Properties/ComputedProperty";
import { ImmutableProperty } from "../Properties/ImmutableProperty";
import { ValueProperty } from "../Properties/ValueProperty";
import { Calculator, FromEntries, Property } from "../../@contract/@types/def";
import { AffixedProperty } from "../Properties/AffixedProperty";
import { Cstr, isClass } from "MWL@2026/modules/@types";

export function Value<T>(defVal: T) {
    return (defaultVal = defVal) => new ValueProperty(defaultVal);
}

export function Constant<T>(value: T) {
    return () => new ImmutableProperty(value);
}
export function Fixed<T>(defVal: T) {
    return (initialVal = defVal) => new ImmutableProperty(initialVal);
}
export function Affixed<T extends object>(Klass: Cstr<T>) {
    return () => new AffixedProperty(new Klass() );
}

export function Computed<
                    T,
                    const Keys   extends string[],
                    const Values extends any   [],
                >(
            keys    : Keys,
            compute : ((...args: Values) => T)|{new(): Calculator<T, Values>},
        ) {

    const values = new Array<unknown>(keys.length) as Values;

    return function (this: PropertiesRecordFor<FromEntries<Keys, Values>>) {

        let computeFct: (...args: Values) => T = compute as any;
        if( isClass(compute) ){
            const computer = new compute();
            computeFct = (...args) => computer.compute(...args);
        }

        const sources = new Array<Property<unknown>>(keys.length);
        for(let i = 0; i < keys.length; ++i)
            // @ts-expect-error
            sources[i] = this.resolve(keys[i]); // ensure init.

        const fct = () => {
            for(let i = 0; i < sources.length; ++i)
                values[i] = sources[i].get();

            return computeFct(...values);
        }

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