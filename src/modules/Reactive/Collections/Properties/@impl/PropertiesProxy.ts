import { isWritable } from "MWL@2026/modules/Reactive/Property";
import { PropertiesProxy} from "../@contract/@types/def";
import { addLink, ReactiveObject } from "MWL@2026/modules/Reactive/Reaction";
import { PropertiesRecord } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";
import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";
import { PROPERTIES } from "MWL@2026/modules/Reactive/Property/@contract/@types/WithProperties";

const PropertiesProxy
    = class <T extends Record<string, Property<any>>>
                                                extends ReactiveObject {

        readonly [PROPERTIES]: PropertiesRecord<T>;

        constructor(propertiesRecord: PropertiesRecord<T>) {
            super();

            this[PROPERTIES] = propertiesRecord;

            const keys = propertiesRecord.keys;
            for(let i = 0; i < keys.length; ++i) {
                Object.defineProperty(this, keys[i], getPropertyDescriptor(i));
            }

            addLink(propertiesRecord, this);
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