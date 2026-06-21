import { observeChanges } from "../Observers/observe";
import { getCallbackRegistry } from "../Observers/EventSource";
import { Callback } from "../CallbackRegistry";
import { getProperties, Properties, PropertiesProvider } from "./createProperties";

function createCache<T extends Record<string, any>>(
                                    target: Properties<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[]
                                ) {

    const cache = new Array(keys.length);

    updateCache(target, keys, cache);

    return cache;
}

function updateCache<T extends Record<string, any>>(
                                    target: Properties<T>,
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
                                    = Callback<Properties<T>>;

export function observePropertiesChanges<T extends Record<string, any>>(
                                    target: PropertiesProvider<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[],
                                    callback: PropertiesCallback<T>
                                ) {

    target = getProperties(target);

    const cache = createCache(target, keys);

    observeChanges(target, function () {

        if( ! updateCache(target, keys, cache) )
            return;

        callback.call(this);
    });
}

export function observePropertyChanges<T extends Record<string, any>>(
                                    target: PropertiesProvider<T>,
                                    key   : Extract<keyof NoInfer<T>, string>,
                                    callback: PropertiesCallback<T>
                                ) {
    observePropertiesChanges(target, [key], callback);
}

export function observeProperties<T extends Record<string, any>>(
                                    target: PropertiesProvider<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[],
                                    callback: PropertiesCallback<T>
                                ) {

    target = getProperties(target);

    observePropertiesChanges(target, keys, callback);

    const registry = getCallbackRegistry(target);
    const ctx = registry.createTriggerContext(null);
    callback.call(ctx);
}


export function observeProperty<T extends Record<string, any>>(
                                    target: PropertiesProvider<T>,
                                    key   : Extract<keyof NoInfer<T>, string>,
                                    callback: PropertiesCallback<T>,
                                ) {
    observeProperties(target, [key], callback);
}