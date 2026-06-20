import { PropertiesProxy } from "./PropertiesStore";
import { getProperties, WithProps } from "./WithProperties";
import { observeChanges } from "../Event";


function createCache<T extends Record<string, any>>(
                                    target: PropertiesProxy<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[]
                                ) {

    const cache = new Array(keys.length);

    updateCache(target, keys, cache);

    return cache;
}

function updateCache<T extends Record<string, any>>(
                                    target: PropertiesProxy<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[],
                                    cache : any[]
                                ) {
    let change = false;
    for(let i = 0; i < keys.length; ++i) {
        const value = target[keys[i]];
        if( value !== cache[i] ) {
            cache[i] = value;
            change = true;
        }
    }

    return change;
}

export function observePropertiesChanges<T extends Record<string, any>>(
                                    target: WithProps<T>|PropertiesProxy<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[],
                                    callback: (origin: unknown) => void
                                ) {

    target = getProperties(target);

    const cache = createCache(target, keys);

    observeChanges(target, (origin: unknown) => {

        if( ! updateCache(target, keys, cache) )
            return;

        callback(origin);
    });
}

export function observePropertyChanges<T extends Record<string, any>>(
                                    target: WithProps<T>|PropertiesProxy<T>,
                                    key   : Extract<keyof NoInfer<T>, string>,
                                    callback: (origin: unknown) => void
                                ) {
    observePropertiesChanges(target, [key], callback);
}

export function observeProperties<T extends Record<string, any>>(
                                    target: WithProps<T>|PropertiesProxy<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[],
                                    callback: (origin: unknown) => void,
                                    origin  : unknown = null
                                ) {

    observePropertiesChanges(target, keys, callback);
    callback(origin);
}


export function observeProperty<T extends Record<string, any>>(
                                    target: WithProps<T>|PropertiesProxy<T>,
                                    key   : Extract<keyof NoInfer<T>, string>,
                                    callback: (origin: unknown) => void,
                                    origin  : unknown = null
                                ) {
    observeProperties(target, [key], callback, origin);
}