import { PropertyController } from "../Property/PropertyController";
import { PropertySlot } from "../Property/PropertySlot";
import { TriggerGate } from "../Property/PropertyObserver";
import { triggerProperty } from "../Property/PropertyNotifyScheduler";

export class ROAlias<T> extends PropertyController<T> {

    readonly source: PropertySlot<T>;

    constructor(source   : PropertySlot<T>) {

        super();

        this.source = source;

        // should not be necessary as the source can only be triggered once.
        const triggerGate = new TriggerGate<T>((slot) => {
            triggerProperty(this, slot.notificationOrigin);
        });

        this.source.observers.push(triggerGate);
    }

    get() {
        return this.source.get();
    }

    override get stamp() {
        return this.source.stamp;
    }
}