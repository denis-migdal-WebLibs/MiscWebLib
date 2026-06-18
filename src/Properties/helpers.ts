import { PropertiesProxy } from "./PropertiesStore";
import { getProxyTarget } from "./ValuesProxy";

export function updateProperties<T extends Record<string, any>>(
                                        target    : PropertiesProxy<T>,
                                        properties: Partial<NoInfer<T>>,
                                        source   ?: unknown
                                    ) {

    const origin = getProxyTarget(target);
    origin.updateProperties(properties, source);
}

// no initial callback call...
export function observeChanges<T extends Record<string, any>>(
                                            target: PropertiesProxy<T>,
                                            callback: () => void
                                        ) {

    const origin = getProxyTarget(target);
    origin.change.addListener(callback);
}

export function observe<T extends Record<string, any>>(
                                            target: PropertiesProxy<T>,
                                            callback: () => void
                                        ) {

    observeChanges(target, callback);
    callback();
}