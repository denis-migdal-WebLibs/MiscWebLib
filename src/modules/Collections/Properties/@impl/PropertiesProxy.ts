import { isWritable } from "MWL@2026/modules/Reactive/Property";
import { PropertiesProxy} from "../@contract/@types/def";
import { ObservableObject, trigger } from "MWL@2026/modules/Observable";
import { addLink, reactionEffect, ReactiveObject } from "MWL@2026/modules/Reactive/Reaction";
import { PropertiesRecord } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";
import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";
import { PROPERTIES } from "MWL@2026/modules/Reactive/Property/@contract/@types/WithProperties";

const PropertiesProxy
    = class <T extends Record<string, Property<any>>>
                                                extends ObservableObject {

        readonly [PROPERTIES]: PropertiesRecord<T>;

        constructor(propertiesRecord: PropertiesRecord<T>) {
            super();

            this[PROPERTIES] = propertiesRecord;

            const onChange       = reactionEffect( () => trigger(this) );
            const reactiveTarget = new ReactiveObject();

            const keys = propertiesRecord.keys;
            for(let i = 0; i < keys.length; ++i) {

                const property = propertiesRecord.resolve(keys[i] as any);
                addLink(property, reactiveTarget, onChange);

                Object.defineProperty(this, keys[i], getPropertyDescriptor(i));
            }
        }
    }

export {PropertiesProxy};


//////
// Descriptors
//////

const cache = new Array<PropertyDescriptor>();

function getPropertyDescriptor<T extends Record<string, any>>(idx: number) {

    if( idx < cache.length )
        return cache[idx];

    const descriptor = cache[idx] = {
        enumerable: true,
        get: function (this: PropertiesProxy<T>) {
            return this[PROPERTIES].getByIdx(idx).get();
        },
        set: function(this: PropertiesProxy<T>, value: any) {

            const property = this[PROPERTIES].getByIdx(idx);

            __ASSERT__(isWritable(property), "set on RO property");

            property.set(value);
        }
    }

    return descriptor;
}