import { NULL_OBJ } from "MWL@2026:core/types";
import { MAIN_EVENT } from "../CallbackRegistry";
import { createEvent, Event } from "../Event";
import { trigger } from "../Observers/Observable";
import { PropertiesDescriptors } from "./Property";
import PropertyHolder, { ON_PROPERTY_CHANGE, PropertiesHolder, PropertyHost } from "./PropertyHolder";

export const CONTROLLERS = Symbol();

export type Properties<T extends Record<string, any>> = T & PropertyHost & {
    [CONTROLLERS]: PropertiesHolder<T>,
    [MAIN_EVENT] : Event<Properties<T>>,
};

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
                this[CONTROLLERS][key].set(value);
            }
        }

    return (initialValues: Partial<NoInfer<T>> = NULL_OBJ): Properties<T> => {

        // We use an object instead of a class as getter/setter needs to be declared on the object. With declared on the prototype, the properties would be ignored when "ownKeys" is used.
        const result = {
            [ON_PROPERTY_CHANGE](origin: unknown) {
                trigger(result, origin);
            }
        } as Properties<T>;

        result[CONTROLLERS] = {} as PropertiesHolder<T>;
        result[MAIN_EVENT]  = createEvent(result);

        const controller = result[CONTROLLERS];

        for(const name in descriptors) {

            controller[name] = new PropertyHolder(result, descriptors[name](result, initialValues[name]));

            Object.defineProperty(result, name, attrDescriptors[name]);
        }

        return result;
    }
}
