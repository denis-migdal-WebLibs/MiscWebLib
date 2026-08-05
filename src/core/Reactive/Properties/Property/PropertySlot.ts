import { triggerProperty } from "./PropertyNotifyScheduler";
import { PropertyController, validate } from "./PropertyController";
import { PropertyObserver } from "./PropertyObserver";

export default class PropertySlot<T> {

    controller: PropertyController<T>;
    readonly originalController: PropertyController<T>;

    constructor(controller: PropertyController<T>) {
        
        this.controller = this.originalController = controller;

        // for createEmptySlot.
        if( controller !== null )
            controller.node.slots.push(this);
    }

    get() {
        return this.controller.get();
    }
    set(value: T, origin: unknown = null) {

        if( this.controller.set === undefined)
            return;
        
        if( ! this.controller.set(value) )
            return;

        if( __DEBUG__ ) validate(this.controller);
        triggerProperty(this.controller, origin);
    }
    get stamp() {
        return this.controller.stamp ?? this.controller.get();
    }

    // observation
    get notificationOrigin() {
        return this.controller.node.notificationOrigin;
    }

    trigger() {
        for(let i = 0; i < this.observers.length; ++i)
            this.observers[i].onTrigger(this);
    }

    notify() {
        for(let i = 0; i < this.observers.length; ++i)
            this.observers[i].onNotify(this);
    }

    observers = new Array<PropertyObserver<T>>();
}

export type PropertiesSlot<T extends Record<string, any>> = {
    [K in keyof T]: PropertySlot<T[K]>
}

// internal use ONLY.
export function createEmptySlot<T>() {
    return new PropertySlot<T>(null as any);
}
export function fillEmptySlot<T>(
                            slot      : PropertySlot<T>,
                            controller: PropertyController<T>
                        ) {
    // @ts-ignore
    slot.controller = slot.originalController = controller;

    controller.node.slots.push(slot);

    return slot;
}