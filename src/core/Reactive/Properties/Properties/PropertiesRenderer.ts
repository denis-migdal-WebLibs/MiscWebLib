import { NO_VALUE, NULL_OP } from "MWL@2026/core/types";
import { CONTROLLERS, Properties } from "./PropertiesImpl";

type BindingCondition<T extends Record<string, any>> = (props: Readonly<T>, cache: Readonly<Record<keyof NoInfer<T>, any>>) => boolean;

// we use it to prevent TS type issues.
type InternalBindingCondition =
    (props: Readonly<Record<string, any>>,
     cache: Readonly<Record<string, any>>) => boolean;

// PropertiesRenderer should not have the responsability to
// watch the properties.
export class PropertiesRenderer<T extends Record<string, any>> {

    readonly properties: Readonly<T>;
    readonly cache = {} as Record<keyof T, any>;

    constructor(properties: Readonly<T>) {
        this.properties = properties;

        for(let key in this.properties)
            this.cache[key] = NO_VALUE; // for the initial render.
    }

    render() {
        let changed = false;

        for(let i = 0; i < this.bindingCallbacks.length; ++i) {
            if( this.bindingConds[i](this.properties, this.cache) ) {
                this.bindingCallbacks[i]();
                changed = true;
            }
        }

        if( ! changed )
            return changed;

        this.afterChangesCallback();

        // update cache...
        for(let key in this.properties)
            this.cache[key] = this.properties[key];

        return changed;
    }

    readonly bindingConds     = new Array<InternalBindingCondition>();
    readonly bindingCallbacks = new Array<() => void>();

    afterChangesCallback = NULL_OP;

    bind(cond:  BindingCondition<T>
              | Extract<keyof T, string>[]
              | Extract<keyof T, string>,
         callback: () => void) {

        if( typeof cond !== "function") {
            if( ! Array.isArray(cond) )
                cond = [cond];

            const keys = cond;

            cond = (properties: Readonly<T>, cache: Readonly<T>) => {

                for(let i = 0; i < keys.length; ++i)
                    if( getStamp(properties, keys[i]) !== cache[keys[i]])
                        return true;
                return false
            }
        }

        this.bindingConds    .push(cond as InternalBindingCondition);
        this.bindingCallbacks.push(callback);
    }

    afterChanges(callback: () => void) {
        this.afterChangesCallback = callback;
    }
}

function getStamp<T extends Record<string, any>>(properties: Readonly<T>, key: keyof T) {

    const crtler = (properties as  Properties<T>
                                 | T & {readonly [CONTROLLERS]: undefined}
                    )[CONTROLLERS];

    if( crtler !== undefined )
        return crtler[key].stamp;

    return properties[key];
}