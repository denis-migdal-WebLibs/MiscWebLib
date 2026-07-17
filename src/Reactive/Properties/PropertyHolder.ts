import { validate } from "./propertiesHelpers";
import { triggerProperty } from "./PropertiesTrigger";
import { PROPERTY_NODE, PropertyController } from "./Property";
import { FixedInstance } from "./Controllers/Fixed";
import { ConstantInstance } from "./Controllers/Constant";
import { ViewInstance } from "./Controllers/View";

export const ON_PROPERTY_CHANGE          = Symbol();
export const FIRST_PROPERTY_CHANGE_ORIGIN = Symbol();

export type PropertyHost = {
    [ON_PROPERTY_CHANGE](origin: unknown): void;
    [FIRST_PROPERTY_CHANGE_ORIGIN]?: unknown;
};

export default class PropertyHolder<T> {

    readonly host: PropertyHost;
    property: PropertyController<T>;

    constructor(host: PropertyHost, property: PropertyController<T>) {
        this.host     = host;
        this.property = property;

        let node = property[PROPERTY_NODE];
        if( node === undefined ) {

            if( property instanceof FixedInstance
             || property instanceof ConstantInstance )
                return;

            node = property[PROPERTY_NODE] = {
                holders     : [],
                resolvedHost: []
            }
        }

        //TODO: handle deps...
        if( property instanceof ViewInstance ) {

            const srcNode = property.source.property[PROPERTY_NODE];
            if( srcNode !== undefined )
                // we share the source resolvedHost.
                node.resolvedHost = srcNode.resolvedHost;
        }

        node.holders     .push(this); // can't contain this.

        if( ! node.resolvedHost.includes(this.host) )
            node.resolvedHost.push(this.host);
    }

    get() {
        return this.property.get();
    }
    set(value: T, origin: unknown = null) {

        if( this.property.set(value) )
            triggerProperty(this.property, origin);

        if( __DEBUG__ ) validate(this.property);
    }
    get stamp() {
        return this.property.stamp ?? this.property.get();
    }
}

export type PropertiesHolder<T extends Record<string, any>> = {
    [K in keyof T]: PropertyHolder<T[K]>
}