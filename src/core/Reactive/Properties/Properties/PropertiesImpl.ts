import { MAIN_EVENT } from "MWL@2026:core/Reactive/CallbackRegistry";
import { createEvent, listen, trigger } from "MWL@2026:exports/Reactive/Events";
import PropertySlot, { PropertiesSlot } from "../Property/PropertySlot";
import { NULL_OBJ } from "MWL@2026:exports/types";
import { PropertiesDescriptors } from "../Property/Property";

export const CONTROLLERS = Symbol();

export class PropertiesImpl<T extends Record<string, any>> {

    readonly [CONTROLLERS] = {} as PropertiesSlot<T>;
    readonly [MAIN_EVENT]  = createEvent(this);

    constructor(descriptors    : PropertiesDescriptors<T>,
                attrDescriptors: Record<keyof NoInfer<T>, PropertyDescriptor>,
                initialValues  : Partial<NoInfer<T>> = NULL_OBJ) {

        // We use an object instead of a class as getter/setter needs to be declared on the object. With declared on the prototype, the properties would be ignored when "ownKeys" is used.
        let stale = false;
        const controller = this[CONTROLLERS];

        const pthis = this;

        const onStale  = function () { stale = true; };
        const onChange = function (this: {origin: unknown}) {
            if( ! stale ) return;
                stale = false;
            trigger(pthis, this.origin);
        };

        for(const name in descriptors) {

            const slot = controller[name] = new PropertySlot(descriptors[name](this as any as T, initialValues[name]));

            listen(slot.staleEvent , onStale );
            listen(slot.changeEvent, onChange);

            Object.defineProperty(this, name, attrDescriptors[name]);
        }
        
    }
}

export type Properties<T extends Record<string, any>> = PropertiesImpl<T> & T;