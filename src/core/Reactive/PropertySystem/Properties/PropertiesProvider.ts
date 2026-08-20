import { pauseReactions, resumeReactions } from "../ReactiveObject/ReactiveScheduler";
import { KEYS, Properties, PROPERTIES } from "./PropertiesImpl";

// distinct to WithProperties.
export type PropertiesProvider<T extends Record<string, any>>
    = {readonly properties: Properties<T>}|Properties<T>;

export type PropertiesShape<T extends PropertiesProvider<any>>
    = T extends PropertiesProvider<infer U> ? U : never;

export function getProperties<T extends Record<string, any>>(
                                        target: PropertiesProvider<T>,
                                    ): Properties<T> {
                                        
    const properties = target.properties;
    if( properties !== undefined )
        return properties;

    return target as Properties<T>;
}

export function getPropertyIndex<T extends Record<string, any>>(
            target: PropertiesProvider<T>,
            name  : keyof NoInfer<T>
        ) {

    return getProperties(target)[KEYS].indexOf(name as string);
}

export function getProperty<T extends Record<string, any>>(
            target: PropertiesProvider<T>,
            name  : keyof NoInfer<T>
        ) {

    target = getProperties(target);

    return target[PROPERTIES][target[KEYS].indexOf(name as string)];
}

/*
export function getPropertyController<T extends Record<string, any>>(
            target: PropertiesProvider<T>,
            name  : keyof NoInfer<T>
        ) {
    target = getProperties(target);

    return target[CONTROLLERS][name].controller;
}
*/

export function updateProperties<T extends Record<string, any>>(
                                        target: PropertiesProvider<T>,
                                        values: Partial<T>
                                    ) {
    
    pauseReactions();

    target = getProperties(target);

    for(const name in values)
        target[name] = values[name]!;

    resumeReactions();
}