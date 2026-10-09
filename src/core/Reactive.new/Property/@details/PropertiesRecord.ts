import { NULL_OBJ } from "MWL@2026/core/types";
import { Property } from "../@contract";
import { InferValues, PropertiesDescriptors, PropertiesRecord } from "../@contract/PropertiesRecord";

export class PropertiesRecordImpl<T extends Record<string, Property<any>>>
                                            implements PropertiesRecord<T> {

    readonly names     : readonly (keyof T)[];
    readonly properties: readonly T[keyof T][];

    readonly descriptors  : PropertiesDescriptors<T>;
    readonly initialValues: Partial<InferValues<T>>;

    constructor(
                    descriptors: PropertiesDescriptors<T>,
                    initialValues: Partial<InferValues<NoInfer<T>>> = NULL_OBJ
                ) {

        this.descriptors   = descriptors;
        this.initialValues = initialValues;

        const keys = this.names = Object.keys(descriptors);
        this.properties = new Array(keys.length);

        for(let i = 0; i < keys.length; ++i)
            this.ensureByIdx(i);
    }

    get<K extends keyof T>(name: K): T[K] {
        return this.properties[this.names.indexOf(name)] as T[K];
    }

    protected ensureByIdx(idx: number) {

        if( this.properties[idx] !== undefined)
            return;

        const name = this.names[idx];
        const property = this.descriptors[name].call(
                                            this,     
                                            this.initialValues[name]
                                        );
        // @ts-expect-error
        this.properties[i] = property;
    }
    resolve<K extends keyof T>(name: K): T[K] {

        const idx = this.names.indexOf(name);

        this.ensureByIdx(idx);

        return this.properties[idx] as T[K];
    }
}