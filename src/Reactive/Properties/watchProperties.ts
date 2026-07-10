import { observeChanges } from "../Observers/observe";
import { getCallbackRegistry } from "../Observers/EventSource";
import { Callback } from "../CallbackRegistry";
import { getProperties, Properties, PropertiesProvider } from "./createProperties";

// It is better to use PropertiesRenderer...

// We use "watch" instead of "observe" as we check the properties value.
// i.e. we do more than just observing...

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

export type PropertiesCallback<T extends Record<string, any>>
                                    = Callback<Properties<T>>;

export function watchPropertiesChanges<T extends Record<string, any>>(
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

export function watchPropertyChanges<T extends Record<string, any>>(
                                    target: PropertiesProvider<T>,
                                    key   : Extract<keyof NoInfer<T>, string>,
                                    callback: PropertiesCallback<T>
                                ) {
    watchPropertiesChanges(target, [key], callback);
}

export function watchProperties<T extends Record<string, any>>(
                                    target: PropertiesProvider<T>,
                                    keys  : readonly (Extract<keyof NoInfer<T>, string>)[],
                                    callback: PropertiesCallback<T>
                                ) {

    target = getProperties(target);

    watchPropertiesChanges(target, keys, callback);

    const registry = getCallbackRegistry(target);
    const ctx = registry.createTriggerContext(null);
    callback.call(ctx);
}


export function watchProperty<T extends Record<string, any>>(
                                    target: PropertiesProvider<T>,
                                    key   : Extract<keyof NoInfer<T>, string>,
                                    callback: PropertiesCallback<T>,
                                ) {
    watchProperties(target, [key], callback);
}