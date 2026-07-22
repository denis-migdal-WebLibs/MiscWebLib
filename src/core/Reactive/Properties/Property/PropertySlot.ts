import { MAIN_EVENT } from "MWL@2026:core/Reactive/CallbackRegistry";
import { createEvent } from "MWL@2026:exports/Reactive/Events";
import { triggerProperty } from "./PropertiesTrigger";
import { PropertyController, validate } from "./Property";

export default class PropertySlot<T> {

    controller: PropertyController<T>;
    readonly originalController: PropertyController<T>;

    constructor(controller: PropertyController<T>) {

        this.controller = this.originalController = controller;

        controller.node.slots.push(this);
    }

    get() {
        return this.controller.get();
    }
    set(value: T, origin: unknown = null) {

        if( ! this.controller.set(value) )
            return;

        if( __DEBUG__ ) validate(this.controller);
        triggerProperty(this.controller, origin);
    }
    get stamp() {
        return this.controller.stamp ?? this.controller.get();
    }

    readonly staleEvent   = createEvent(this);
    readonly changeEvent  = createEvent(this);
    readonly [MAIN_EVENT] = this.changeEvent;
}

export type PropertiesSlot<T extends Record<string, any>> = {
    [K in keyof T]: PropertySlot<T[K]>
}