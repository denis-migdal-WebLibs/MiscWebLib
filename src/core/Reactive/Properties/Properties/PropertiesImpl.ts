import { MAIN_EVENT } from "MWL@2026:core/Reactive/CallbackRegistry";
import { createEvent, trigger } from "MWL@2026:exports/Reactive/Events";
import PropertySlot, { PropertiesSlot } from "../Property/PropertySlot";
import { NULL_OBJ } from "MWL@2026:exports/types";
import { PropertiesDescriptors } from "../Property/Property";
import { NotifyGate } from "../Property/PropertyObserver";

export const CONTROLLERS = Symbol();

export class PropertiesImpl<T extends Record<string, any>> {

    readonly [CONTROLLERS] = {} as PropertiesSlot<T>;
    readonly [MAIN_EVENT]  = createEvent(this);

    constructor(descriptors    : PropertiesDescriptors<T>,
                attrDescriptors: Record<keyof NoInfer<T>, PropertyDescriptor>,
                initialValues  : Partial<NoInfer<T>> = NULL_OBJ) {

        // We use an object instead of a class as getter/setter needs to be declared on the object. With declared on the prototype, the properties would be ignored when "ownKeys" is used.
        const controller = this[CONTROLLERS];

        const notifyGate = new NotifyGate<any>((slot) => {
            trigger(this, slot.notificationOrigin);
        })

        for(const name in descriptors) {

            const slot = controller[name] = new PropertySlot(descriptors[name](this as any as T, initialValues[name]));

            slot.observers.push(notifyGate);

            Object.defineProperty(this, name, attrDescriptors[name]);
        }
        
    }
}

export type Properties<T extends Record<string, any>> = PropertiesImpl<T> & T;