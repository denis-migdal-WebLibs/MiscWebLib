import { PropertiesProxy } from "./PropertiesStore";
import { getProperties, WithProps } from "./WithProperties";
import { getCallbackRegistry, observeChanges } from "../Event";
import { Callback } from "../CallbackRegistry";


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

type PropertiesCallback<T extends Record<string, any>>
                                    = Callback<PropertiesProxy<T>>;

export function observePropertiesChanges<T extends Record<string, any>>(
                                    target: WithProps<T>|PropertiesProxy<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[],
                                    callback: PropertiesCallback<T>
                                ) {

    target = getProperties(target);

    const cache = createCache(target, keys);

    observeChanges(target, function () {

        if( ! updateCache(target, keys, cache) )
            return;

        // @ts-ignore: bad TS type inference
        callback.call(this);
    });
}

export function observePropertyChanges<T extends Record<string, any>>(
                                    target: WithProps<T>|PropertiesProxy<T>,
                                    key   : Extract<keyof NoInfer<T>, string>,
                                    callback: PropertiesCallback<T>
                                ) {
    observePropertiesChanges(target, [key], callback);
}

export function observeProperties<T extends Record<string, any>>(
                                    target: WithProps<T>|PropertiesProxy<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[],
                                    callback: PropertiesCallback<T>
                                ) {

    observePropertiesChanges(target, keys, callback);

    const registry = getCallbackRegistry(target);
    const ctx = registry.createTriggerContext(null);
    // @ts-ignore: bad TS type inference
    callback.call(ctx);
}


export function observeProperty<T extends Record<string, any>>(
                                    target: WithProps<T>|PropertiesProxy<T>,
                                    key   : Extract<keyof NoInfer<T>, string>,
                                    callback: PropertiesCallback<T>,
                                ) {
    observeProperties(target, [key], callback);
}