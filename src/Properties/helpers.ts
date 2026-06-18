import { PropertiesProxy, PropertiesStore } from "./PropertiesStore";
import { getProxyTarget } from "./ValuesProxy";

export function updateProperties<T extends Record<string, any>>(
                                        target    : PropertiesProxy<T>,
                                        properties: Partial<NoInfer<T>>,
                                        source   ?: unknown
                                    ) {

    // dunno why the type ins't properly inferred.
    const origin = getProxyTarget(target) as PropertiesStore<T>;
    origin.updateProperties(properties, source);
}

// no initial callback call...
export function observeChanges<T extends Record<string, any>>(
                                            target: PropertiesProxy<T>,
                                            callback: () => void
                                        ) {

    const origin = getProxyTarget(target) as PropertiesStore<T>;
    origin.event.addListener(callback);
}

export function observe<T extends Record<string, any>>(
                                            target: PropertiesProxy<T>,
                                            callback: () => void
                                        ) {

    observeChanges(target, callback);
    callback();
}