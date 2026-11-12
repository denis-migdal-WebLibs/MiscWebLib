import { NULL_OBJ } from "MWL@2026/modules/@types";
import { Property } from "../@contract/@types/def";
import { InferValues, PropertiesDescriptors, PropertiesRecord } from "../@contract/@types/PropertiesRecord";
import { addLink, ReactiveObject } from "../../Reaction";

const PropertiesRecord = 
    class <T extends Record<string, Property<any>>>
            extends ReactiveObject
            implements PropertiesRecord<T> {

    readonly keys      : readonly string[];
    readonly properties: readonly Property<unknown>[];

    readonly descriptors  : PropertiesDescriptors<T>;
    readonly initialValues: Partial<Readonly<InferValues<T>>>;

    constructor(
                    descriptors: PropertiesDescriptors<T>,
                    initialValues: Partial<Readonly<InferValues<NoInfer<T>>>> = NULL_OBJ
                ) {
        super();

        this.descriptors   = descriptors;
        this.initialValues = initialValues;

        const keys = this.keys = Object.keys(descriptors);
        this.properties = new Array(keys.length);

        for(let i = 0; i < keys.length; ++i) {
            this.ensureByIdx(i);
            addLink( this.properties[i], this );
        }
    }

    get<K extends Extract<keyof T, string>>(name: K): T[K] {
        return this.getByIdx(this.keys.indexOf(name));
    }

    getByIdx<V extends T[keyof T]>(idx: number): V {
        return this.properties[idx] as V;
    }

    protected ensureByIdx(idx: number) {

        if( this.properties[idx] !== undefined)
            return;

        const name = this.keys[idx];
        const property = this.descriptors[name].call(
                                            this,     
                                            this.initialValues[name]
                                        );
        // @ts-ignore
        this.properties[idx] = property;
    }
    resolve<K extends Extract<keyof T, string>>(name: K): T[K] {

        const idx = this.keys.indexOf(name);

        this.ensureByIdx(idx);
        return this.getByIdx(idx);
    }
}

export {PropertiesRecord};