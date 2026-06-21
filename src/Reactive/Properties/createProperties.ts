import { createEvent, Event } from "../Event";
import { MAIN_EVENT, trigger } from "../Observers/EventSource";
import { PropertiesControllers, PropertiesDescriptors } from "./Property";

const CONTROLLERS = Symbol();

export type Properties<T extends Record<string, any>> = {
    [CONTROLLERS]: PropertiesControllers<T>,
    [MAIN_EVENT] : Event<Properties<T>>,
} & T;

// We use an object instead of a class as getter/setter needs to be declared
// on the object. With declared on the prototype, the properties would be
// ignored when "ownKeys" is used.
export default function createProperties<T extends Record<string,any>>(
                        descriptors  : PropertiesDescriptors<T>,
                        initialValues: null|Partial<T> = null
                    ): Properties<T> {

    const result = {} as Properties<T>;

    result[CONTROLLERS] = {} as PropertiesControllers<T>;
    result[MAIN_EVENT]  = createEvent(result);

    const controller = result[CONTROLLERS];

    for(const name in descriptors) {

        //TODO: initial value here + validate...
        controller[name] = descriptors[name](result);

        Object.defineProperty(result, name, {
            enumerable: true,
            get: function (this: Properties<T>) {
                return this[CONTROLLERS][name].get();
            },
            set: function(this: Properties<T>, value: any) {

                // no changes...
                if( ! controller[name].set(value) ) return;

                // no needs to test it in get().
                if( __DEBUG__ ) validate(this, name);
                
                notifyChange(this)
            }
        });
    }

    //TODO: move as initial values...
    if( initialValues !== null)
        updateProperties(result, initialValues);

    return result;
}

type WithProperties<T extends Record<string, any>> = {
    readonly properties  : Properties<T>;
    readonly [MAIN_EVENT]: Event<Properties<T>>;
}

export function WithProperties<T extends Record<string, any>>(
                                    descriptors: PropertiesDescriptors<T>
                                ) {

    return class WithProperties {

        readonly properties  : Properties<T>;
        readonly [MAIN_EVENT]: Event<Properties<T>>;

        constructor(initialValues: Partial<T> = {}) {
            this.properties = createProperties(descriptors, initialValues);
            this[MAIN_EVENT] = this.properties[MAIN_EVENT];
        }
    }
}

// declare methods outside to not pollute the object.

function notifyChange<T extends Record<string, any>>(
                proxy: Properties<T>,
                origin: unknown = proxy) {

        for(let name in proxy[CONTROLLERS])
            proxy[CONTROLLERS][name].markStale();

        trigger(proxy, origin);
}

export function validate<T extends Record<string, any>>(
                                        proxy: Properties<T>,
                                        name : Extract<keyof T, string>,
                                    ) {

    if( proxy[CONTROLLERS][name].validate !== undefined ) {
        const result = proxy[CONTROLLERS][name].validate();
        if( result !== true ) {
            throw new Error(`Validation "${result.validation}" failed on property ${name}: got ${JSON.stringify(result.value)}.`);
        }
    }
}

export type PropertiesProvider<T extends Record<string, any>>
    = Properties<T>|WithProperties<T>;

export function getProperties<T extends Record<string, any>>(
                                        target: PropertiesProvider<T>,
                                    ): Properties<T> {
    if( "properties" in target )
        return target.properties;

    return target;
}

export function updateProperties<T extends Record<string, any>>(
                                        target: PropertiesProvider<T>,
                                        values: Partial<T>,
                                        origin: unknown = null
                                    ) {

    target = getProperties(target);

    let changed = false;

    for(const name in values) {

        if( ! target[CONTROLLERS][name].set(values[name]) )
            continue;

        changed = true;

        // no needs to test it in get().
        if( __DEBUG__ ) validate(target, name);
    }
    
    if(changed)
        notifyChange(target, origin);
}

