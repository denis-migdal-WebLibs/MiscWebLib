import { NULL_OBJ } from "MWL@2026:exports/types";
import { createEvent, Event, trigger, listen } from "MWL@2026:exports/Reactive/Events";
import { MAIN_EVENT } from "MWL@2026:core/Reactive/CallbackRegistry";
import { PropertiesDescriptors } from "../Property/Property";
import PropertySlot, {PropertiesSlot} from "../Property/PropertySlot";

export const CONTROLLERS = Symbol();

export type Properties<T extends Record<string, any>> = T & {
    [CONTROLLERS]: PropertiesSlot<T>,
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
        const pthis = {} as Properties<T>;

        pthis[CONTROLLERS] = {} as PropertiesSlot<T>;
        pthis[MAIN_EVENT]  = createEvent(pthis);

        let stale = false;
        const controller = pthis[CONTROLLERS];

        const onStale  = function () { stale = true; };
        const onChange = function (this: {origin: unknown}) {
            if( ! stale ) return;
                stale = false;
            trigger(pthis, this.origin);
        };

        for(const name in descriptors) {

            const slot = controller[name] = new PropertySlot(descriptors[name](pthis, initialValues[name]));

            listen(slot.staleEvent , onStale );
            listen(slot.changeEvent, onChange);

            Object.defineProperty(pthis, name, attrDescriptors[name]);
        }

        return pthis;
    }
}
