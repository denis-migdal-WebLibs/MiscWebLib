import { listen, ObservableProxy } from "MWL@2026:exports/Reactive/Events";
import { Fixed, Value } from "../Controllers";
import { buildAttrDescriptors, createProperties, createPropertiesFactory } from "./createProperties";
import { CONTROLLERS, Properties, PropertiesDescriptors, PropertiesImpl } from "./PropertiesImpl";
import { NULL_OBJ } from "MWL@2026:core/types";
import { PropertyController, PropertyDescriptor } from "../Property/PropertyController";
import { FixedInstance } from "../Controllers/Fixed";
import { ValueInstance } from "../Controllers/Value";

const RO = Symbol();
const RW = Symbol();

type Keys<T extends Record<string, any>> = {
    [K in keyof T]?: typeof RO|typeof RW
}

type ROKeys<T extends Record<string, any>, K extends Keys<T>> = {
    // @ts-ignore
    readonly [N in keyof K as K[N] extends typeof RO ? N : never]: T[N]
};

type RWKeys<T extends Record<string, any>, K extends Keys<T>> = {
    // @ts-ignore
    [N in keyof K as K[N] extends typeof RW ? N : never]: T[N]
};

type Sub<T extends Record<string, any>, K extends Keys<T>> = Expand<ROKeys<T, K> & RWKeys<T,K>>;

export function subProperties<
                                T extends Record<string, any>,
                                K extends Keys<NoInfer<T>>
                            >(
                                    target: Properties<T>,
                                    keys  : K
                                ): Properties<Sub<T, K>> {
    //TODO: sub...
}

const props = createProperties({
    foo: Value(34),
    faa: Fixed(34),
    fuu: Value(34)
})

//TODO: move 2 types
type Expand<T> = T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

function expand<T>(t: T): Expand<T> { return t as any; };

const res = subProperties(props, {foo: RW, faa: RO});

type ROPropertyDescriptor<CTX extends Record<string, any>, T> = (ctx: Readonly<CTX>, initialValue?: T) => PropertyController<T>;

type RWPropertyDescriptor<CTX extends Record<string, any>, T> = (ctx: Readonly<CTX>, initialValue?: T) => PropertyController<T> & {set(value: T): boolean};

type PropertiesType<T extends PropertiesDescriptors<any>> = Expand<{
    [K in keyof T as ReturnType<T[K]> extends {set(value: any, stamp?: unknown): boolean}
                            ? K
                            : never]: T[K] extends PropertyDescriptor<any, infer U> ? U : never;
} & {
    readonly [K in keyof T]: T[K] extends PropertyDescriptor<any, infer U> ? U : never;
}>;

/***/
export function createPropertiesFactory2<T extends PropertiesDescriptors<any>>(
                        descriptors  : T
                    ) {

    const attrDescriptors = buildAttrDescriptors(descriptors);

    return (initialValues: Partial<PropertiesType<T>> = NULL_OBJ): Properties<PropertiesType<T>> =>
        new PropertiesImpl(descriptors, attrDescriptors, initialValues) as Properties<PropertiesType<T>>;
}

function Model<T extends PropertiesDescriptors<any>>(desc: T) {
    const factory = createPropertiesFactory2(desc);

    class Model extends ObservableProxy<PropertiesType<T>> {
        
        protected readonly internals;
        readonly properties;

        constructor() {
            const internals  = factory();
            const properties = internals;
            super(properties);

            this.properties = properties;
            this.internals  = internals;
        }
    }

    //TODO: properties from internals.
    //TODO: redirect properties.

    return Model as {new (): PropertiesType<T> & Model};
}

const Question = Model({foo: Value(34)});

class Question2 extends Model({foo: Fixed(34), faa: Value("e")}) {}

const q = new Question();
const q2 = new Question2();

q2.properties.faa = "34";
q2.properties.foo = 33;

q2.faa = "23";
q2.foo = 23;

listen(q2, function() {
    this.target.foo = 34;
});

type T1 = FixedInstance<number> extends {set(value: unknown, stamp?: unknown): boolean} ? true : false;

type T2 = ValueInstance<number> extends {set(value: unknown, stamp?: unknown): boolean} ? true : false;

