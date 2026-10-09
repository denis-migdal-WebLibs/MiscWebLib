import { NULL_OBJ } from "MWL@2026/@exports/types";
import { InferProperties, Properties, PropertiesDescriptors } from "../@contrat";
import { ObservableObject, trigger } from "MWL@2026/@exports/Observable";
import { REACTIVE_NODE } from "MWL@2026/core/Reactive.new/Reaction/@contract/internals";
import { ReactiveNodeImpl } from "MWL@2026/core/Reactive.new/Reaction/@details/ReactiveNode";
import { ReactiveObject, addLink, effect } from "MWL@2026/core/Reactive.new/Reaction";
import { Property } from "MWL@2026/core/Reactive.new/Property/@contract";
import { isWritable } from "MWL@2026/core/Reactive.new/Property/@details/Properties/ValueProperty";

export function PropertiesFactoryImpl<
                                    Desc extends PropertiesDescriptors<any>,
                                    T    extends InferProperties<Desc>
                                >(
                                    descriptors   : Desc,
                                    initialValues?: Partial<T>
                                ): Properties<T> {
    return new PropertiesImpl(descriptors, initialValues) as any;
}

export const KEYS       = Symbol();
export const PROPERTIES = Symbol();

export class PropertiesImpl<T extends Record<string, any>>
                                                extends  ObservableObject
                                                implements ReactiveObject {

    // not ideal, but avoid using mixin...
    readonly [REACTIVE_NODE] = new ReactiveNodeImpl();

    //TODO: provider (?).
    readonly [KEYS]: readonly string[];
    readonly [PROPERTIES] = new Array<Property<any>>();

    constructor(descriptors    : PropertiesDescriptors<T>,
                initialValues  : Partial<NoInfer<T>> = NULL_OBJ) {

        super();

        const keys       = this[KEYS] = Object.keys(descriptors);
        const properties = this[PROPERTIES];
        properties.length = this[KEYS].length;

        const onChange = effect( () => trigger(this) );

        for(let i = 0; i < keys.length; ++i) {

            const name = keys[i];
            const property = descriptors[name].call(
                                                // TODO: give provider.
                                                this as any as T,     
                                                initialValues[name]
                                            );
            
            properties[i] = property;

            addLink(property, this, onChange);
            Object.defineProperty(this, name, getPropertyDescriptor(i));
        }
    }
}

//////
// Descriptors
//////

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
            __ASSERT__(
                        isWritable(this[PROPERTIES][idx]),
                        "set on RO property"
                    );

            this[PROPERTIES][idx].set(value);
        }
    }

    return descriptor;
}