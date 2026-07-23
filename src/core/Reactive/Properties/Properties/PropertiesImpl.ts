import { ObservableObject, trigger } from "MWL@2026:exports/Reactive/Events";
import PropertySlot, { PropertiesSlot } from "../Property/PropertySlot";
import { NULL_OBJ } from "MWL@2026:exports/types";
import { PropertyDescriptor as PropDesc } from "../Property/PropertyController";
import { NotifyGate } from "../Property/PropertyObserver";

export type PropertiesDescriptors<T extends Record<string, any>> = {
    [K in keyof T]: PropDesc<T, T[K]>
}

export type GetPropertiesType<T extends PropertiesDescriptors<any>>
    = T extends PropertiesDescriptors<infer U> ? U : never;

export const CONTROLLERS = Symbol();

export class PropertiesImpl<T extends Record<string, any>>
                                                    extends ObservableObject {

    readonly [CONTROLLERS] = {} as PropertiesSlot<T>;

    constructor(descriptors    : PropertiesDescriptors<T>,
                attrDescriptors: Record<keyof NoInfer<T>, PropertyDescriptor>,
                initialValues  : Partial<NoInfer<T>> = NULL_OBJ) {

        super();

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