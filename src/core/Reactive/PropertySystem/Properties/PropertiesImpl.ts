import { NULL_OBJ } from "MWL@2026/exports/types";
import { PropertyController } from "../Property/PropertyController";
import { ReactiveObject } from "../ReactiveObject/ReactiveObject";
import { completeProperty, createIncompleteProperty, Property } from "../Property/Property";
import { addLink } from "../Property/sync/links";

export const PROPERTIES = Symbol();

export type PPDescriptor<P extends Record<string, any>, T>
        = (this: Readonly<P>, initialValue?: T) => PropertyController<T>

export type PropertiesDescriptors<T extends Record<string, any>> = {
    [K in keyof T]: PPDescriptor<T, T[K]>
}

export const KEYS = Symbol();

export class PropertiesImpl<T extends Record<string, any>>
                                extends ReactiveObject {

    readonly [PROPERTIES] = new Array<Property<any>>();
    readonly [KEYS]: readonly string[];

    constructor(descriptors    : PropertiesDescriptors<T>,
                initialValues  : Partial<NoInfer<T>> = NULL_OBJ) {

        super();

        //setID(this, "Properties");

        // We use an object instead of a class as getter/setter needs to be declared on the object. With declared on the prototype, the properties would be ignored when "ownKeys" is used.

        const keys = this[KEYS] = Object.keys(descriptors);
        const properties = this[PROPERTIES];
        properties.length = keys.length;

        // requires to avoid order-related issue.
        for(let i = 0; i < keys.length; ++i)
            properties[i] = createIncompleteProperty();

        for(let i = 0; i < keys.length; ++i) {
            const name = keys[i];

            const controller = descriptors[name].call(
                                                        this as any as T,       
                                                        initialValues[name]
                                                    );

            const property = completeProperty(properties[i], controller);

            //setID(property, keys[i]);
            addLink(property, this);

            Object.defineProperty(this, name, getPropertyDescriptor(i));
        }
    }
}

export type Properties<T extends Record<string, any>> = PropertiesImpl<T> & T;


const cache = new Array<PropertyDescriptor>();

function getPropertyDescriptor<T extends Record<string, any>>(idx: number) {

    if( idx < cache.length )
        return cache[idx];

    const descriptor = cache[idx] = {
        enumerable: true,
        get: function (this: PropertiesImpl<T>) {
            return this[PROPERTIES][idx].get();
        },
        set: function(this: PropertiesImpl<T>, value: any) {
            this[PROPERTIES][idx].set(value);
        }
    }

    return descriptor;
}