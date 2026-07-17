// @ts-nocheck

import { NULL_OBJ } from "MWL@2026:types";
import { createEvent, Event } from "../Event";
import { MAIN_EVENT, trigger } from "../Observers/EventSource";
import { PropertiesControllers, PropertiesDescriptors } from "./Property";

export const CONTROLLERS = Symbol();

export type Properties<T extends Record<string, any>> = {
    [CONTROLLERS]: PropertiesControllers<T>,
    [MAIN_EVENT] : Event<Properties<T>>,
} & T;

export function createPropertiesFactory<T extends Record<string,any>>(
                        descriptors  : PropertiesDescriptors<T>
                    ) {

    const attrDescriptors = {} as Record<keyof T, PropertyDescriptor>;
    for(const key in descriptors)
        attrDescriptors[key] = {
            enumerable: true,
            get: function (this: Properties<T>) {
                return this[CONTROLLERS][key].get();
            },
            set: function(this: Properties<T>, value: any) {

                // no changes...
                if( ! this[CONTROLLERS][key].set(value) ) return;

                // no needs to test it in get().
                if( __DEBUG__ ) validate(this, key);
                
                notifyChange(this);
            }
        }

    return (initialValues: Partial<NoInfer<T>> = NULL_OBJ): Properties<T> => {
        const result = {} as Properties<T>;

        result[CONTROLLERS] = {} as PropertiesControllers<T>;
        result[MAIN_EVENT]  = createEvent(result);

        const controller = result[CONTROLLERS];

        for(const name in descriptors) {

            controller[name] = descriptors[name](result, initialValues[name]);

            if( __DEBUG__ ) validate(result, name);

            Object.defineProperty(result, name, attrDescriptors[name]);
        }

        return result;
    }
}

// We use an object instead of a class as getter/setter needs to be declared
// on the object. With declared on the prototype, the properties would be
// ignored when "ownKeys" is used.
export default function createProperties<T extends Record<string,any>>(
                        descriptors  : PropertiesDescriptors<T>,
                        initialValues: Partial<NoInfer<T>> = NULL_OBJ
                    ): Properties<T> {

    const result = {} as Properties<T>;

    result[CONTROLLERS] = {} as PropertiesControllers<T>;
    result[MAIN_EVENT]  = createEvent(result);

    const controller = result[CONTROLLERS];

    for(const name in descriptors) {

        controller[name] = descriptors[name](result, initialValues[name]);

        if( __DEBUG__ ) validate(result, name);

        Object.defineProperty(result, name, {
            enumerable: true,
            get: function (this: Properties<T>) {
                return this[CONTROLLERS][name].get();
            },
            set: function(this: Properties<T>, value: any) {

                // no changes...
                if( ! this[CONTROLLERS][name].set(value) ) return;

                // no needs to test it in get().
                if( __DEBUG__ ) validate(this, name);
                
                notifyChange(this);
            }
        });
    }

    return result;
}

export type WithProperties<T extends Record<string, any>> = {
    readonly properties  : Properties<T>;
    readonly [MAIN_EVENT]: Event<Properties<T>>;
}

export function WithProperties<T extends Record<string, any>>(
                                    descriptors: PropertiesDescriptors<T>
                                ) {

    const propertiesFactory = createPropertiesFactory(descriptors);

    return class WithProperties {

        readonly properties  : Properties<T>;
        readonly [MAIN_EVENT]: Event<Properties<T>>;

        constructor(initialValues: Partial<T> = {}) {
            this.properties = propertiesFactory(initialValues);
            this[MAIN_EVENT] = this.properties[MAIN_EVENT];
        }
    }
}

// declare methods outside to not pollute the object.

export function notifyChange<T extends Record<string, any>>(
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
                                        
    const properties = target.properties;
    if( properties !== undefined )
        return properties;

    return target as Properties<T>;
}

export function setProperty<
                                T extends Record<string, any>,
                                K extends Extract<keyof T, string>
                            >(
                                        target: PropertiesProvider<T>,
                                        name  : NoInfer<K>,
                                        value : NoInfer<T[K]>,
                                        origin: unknown = null
                                    ) {
    target = getProperties(target);

    if( ! target[CONTROLLERS][name].set(value) )
        return;

    if( __DEBUG__ ) validate(target, name);
    notifyChange(target, origin);
}

export function updateProperties<T extends Record<string, any>>(
                                        target: PropertiesProvider<T>,
                                        values: Partial<T>,
                                        origin: unknown = null
                                    ) {

    target = getProperties(target);

    let changed = false;

    for(const name in values) {

        if( ! target[CONTROLLERS][name].set(values[name]!) )
            continue;

        changed = true;

        // no needs to test it in get().
        if( __DEBUG__ ) validate(target, name);
    }
    
    if(changed)
        notifyChange(target, origin);
}

