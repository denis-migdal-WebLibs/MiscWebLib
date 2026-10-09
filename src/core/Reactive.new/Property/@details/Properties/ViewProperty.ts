import { addLink, ReactiveObject } from "MWL@2026/core/Reactive.new/Reaction";
import { ViewProperty } from "../../@contract";
import { Cstr, isClass, NO_VALUE } from "MWL@2026/core/types";

// We decouple sources and compute to avoid a second generic parameter.
export class ViewPropertyImpl<T>  extends ReactiveObject
                               implements ViewProperty<T> {

    protected cache: T = NO_VALUE;
    protected readonly compute: () => T;

    constructor(
                    dependencies: readonly ReactiveObject[],
                    compute: () => T
                ) {
        super();

        this.compute = compute;
        const onChange = () => this.cache = NO_VALUE;

        for(let i = 0; i < dependencies.length; ++i)
            addLink(dependencies[i], this, onChange);
    }

    get() {
        if( this.cache !== NO_VALUE )
            return this.cache;

        return this.cache = this.compute();
    }

    get isResolved() { return this.cache !== NO_VALUE }
}

//////
// Factory
//////

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


type PropertyProvider<T extends Record<string, ReactiveObject> = Record<string, ReactiveObject>> = {
    get<K extends keyof T>(name: K): T[K];
}

type ShapeOf<Provider extends PropertyProvider> = Provider extends  PropertyProvider<infer U> ? U
                          : never;

type KeysOf<Provider extends PropertyProvider> = Extract<keyof ShapeOf<Provider>, string>;

type ValuesOf<
                Provider extends PropertyProvider,
                K        extends KeysOf<Provider>[]
            > = {
    [I in keyof K]: ShapeOf<Provider>[K[I]];
};

// We can't know the type of the PropertiesProvider beforehand.
export function View<
                        T,
                        Keys   extends string[],
                        Values extends any[]
                    >(
                        keys     : Keys,
                        converter: ConvertArg<T, Values>
                    ) {

    //TODO: this with the correct type...
    return function () {

        const sources = new Array<ReactiveObject>(keys.length);

        for(let i = 0; i < keys.length; ++i)
            sources[i] = {} as any; //this.get(keys[i]);

        // TODO; more complex
        const transform = getConversionFct(converter);

        return new ViewPropertyImpl(sources, transform);
    };
}

/*
export function View<T,
                    Provider extends PropertyProvider,
                    Keys     extends KeysOf<Provider>[],
                    Sources  extends ValuesOf<Provider, Keys>
                >(
            keys     : Keys,
            converter: Cstr<ViewConverter<T, Sources>>|ConvertFct<T, Sources>
        ) {

    return function (this: Provider) {

        const sources = new Array<ReactiveObject>(keys.length);

        for(let i = 0; i < keys.length; ++i)
            sources[i] = this.get(keys[i]);

        const transform = getConversionFct(converter);

        return new ViewPropertyImpl(sources as Sources, transform);
    };
    
}
*/