import { Descriptors, Properties } from "./Property";
import { ProxyTarget, ValuesProxy } from "./ValuesProxy";

import { createEventFactory, trigger } from "@/Event";

export type PropertiesProxy<T extends Record<string, any>>
        = ValuesProxy<T, PropertiesStore<T>>;

// source can be arbitrary.
const createEvent = createEventFactory<[source: unknown]>();

export class PropertiesStore<T extends Record<string, any>>
                                                implements ProxyTarget<T> {

    readonly properties = {} as Properties<T>;

    readonly mainProxy: PropertiesProxy<T>;

    constructor(descriptors: Descriptors<T>,
                 proxy_cstr: new <U extends ProxyTarget<T>>(target: U) => ValuesProxy<T,U>) {

        this.mainProxy = new proxy_cstr(this);

        for(const propname in descriptors)
            this.properties[propname] = descriptors[propname](this.mainProxy);
    }

    get<K extends Extract<keyof T, string>>(name: K): T[K] {
        return this.properties[name].get();
    }

    set<K extends Extract<keyof T, string>>(name: K, value: T[K], source: unknown = null) {
            
        // no changes...
        if( ! this.properties[name].set(value) )
            return;

        // no needs to test it in get().
        if( __DEBUG__ ) this.validate(name);
        
        this.onChange(source);
    }

    updateProperties(values: Partial<T>, source: unknown = null) {

        let changed = false;

        for(const name in values) {

            if( ! this.properties[name].set(values[name]) )
                continue;

            changed = true;

            // no needs to test it in get().
            if( __DEBUG__ ) this.validate(name);
        }
        
        if(changed)
            this.onChange(source);
    }

    validate(name: Extract<keyof T, string>) {
        if( this.properties[name].validate !== undefined ) {
            const result = this.properties[name].validate();
            if( result !== true ) {
                throw new Error(`Validation "${result.validation}" failed on property ${name}: got ${JSON.stringify(result.value)}.`);
            }
        }
    }

    // we hide internals.
    readonly event = createEvent<unknown>(this);

    protected onChange(source: unknown) {

        for(let name in this.properties)
            this.properties[name].markStale();

        trigger(this.event, source);
    }
}