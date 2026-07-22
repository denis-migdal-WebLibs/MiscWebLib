import { Cstr, FCT_FALSE, NO_VALUE } from "MWL@2026:core/types";
import { PropertyController } from "../Property/PropertyController";
import { getProperties } from "../Properties/PropertiesProvider";
import { CONTROLLERS, Properties } from "../Properties/PropertiesImpl";
import PropertySlot from "../Property/PropertySlot";
import { triggerProperty } from "../Property/PropertiesTrigger";
import { createPropertyNode } from "../Property/PropertyNode";
import { TriggerGate } from "../Property/PropertyObserver";

type ViewConverter<T, U> = {convert(value: U): T};
//(target: U, prevVal: T|typeof NO_VALUE) => T;

export class ViewInstance<T, U> implements PropertyController<T> {

    protected readonly converter : ViewConverter<T, U>;

    readonly source: PropertySlot<U>;
    
    protected cache     : T|typeof NO_VALUE = NO_VALUE;
    protected cacheStamp: any = NO_VALUE;

    constructor(
                    source   : PropertySlot<U>,
                    Converter: Cstr<ViewConverter<T, U>>
                ) {

        this.source    = source;
        this.converter = new Converter();

        // should not be necessary as the source can only be triggered once.
        const triggerGate = new TriggerGate<U>((slot) => {
            triggerProperty(this, slot.notificationOrigin);
        });

        this.source.observers.push(triggerGate);
    }

    get() {

        const stamp = this.stamp;

        if( this.cache === NO_VALUE || this.cacheStamp !== stamp)
            this.cache = this.converter.convert(this.source.get());

        this.cacheStamp = stamp;
        return this.cache;
    }

    get stamp() {
        return this.source.stamp;
    }

    readonly node = createPropertyNode<T>();

    declare set: typeof FCT_FALSE;
    static {
        this.prototype.set = FCT_FALSE;
    }
}

export default function View<K extends string, T, U>(
            target: K,
            Adapter  : Cstr<ViewConverter<T, U>>
        ) {

    return (ctx: Readonly<Record<K, U>>) => {
        const source = getProperties(ctx as Properties<Record<K, U>>)[CONTROLLERS][target];
        return new ViewInstance( source, Adapter )
    };
}