import { NULL_OBJ } from "MWL@2026:exports/types";
import { PropertiesDescriptors } from "../Property/Property";
import { CONTROLLERS, Properties, PropertiesImpl } from "./PropertiesImpl";

export function createPropertiesFactory<T extends Record<string,any>>(
                        descriptors  : PropertiesDescriptors<T>
                    ) {

    const attrDescriptors = buildAttrDescriptors(descriptors);

    return (initialValues: Partial<NoInfer<T>> = NULL_OBJ): Properties<T> =>
        new PropertiesImpl(descriptors, attrDescriptors, initialValues) as Properties<T>;
}

export function createProperties<T extends Record<string,any>>(
                        descriptors  : PropertiesDescriptors<T>,
                        initialValues: Partial<NoInfer<T>> = NULL_OBJ
                    ) {
    return createPropertiesFactory(descriptors)(initialValues);
}

export function buildAttrDescriptors<T extends Record<string, any>>(
                                        descriptors: PropertiesDescriptors<T>
                                    ) {
    const attrDescriptors = {} as Record<keyof T, PropertyDescriptor>;
    for(const key in descriptors)
        attrDescriptors[key] = {
            enumerable: true,
            get: function (this: Properties<T>) {
                return this[CONTROLLERS][key].get();
            },
            set: function(this: Properties<T>, value: any) {
                this[CONTROLLERS][key].set(value);
            }
        }
        
    return attrDescriptors;
}