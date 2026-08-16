import { pauseReactions, resumeReactions } from "../ReactiveObject/ReactiveScheduler";
import { KEYS, Properties, PROPERTIES } from "./PropertiesImpl";
import { WithProperties } from "./WithProperties";

// in reality WithProperties<T> should be useless
export type PropertiesProvider<T extends Record<string, any>>
    = WithProperties<T>|Properties<T>;

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

    return target[KEYS].indexOf(name as string);
}

export function getProperty<T extends Record<string, any>>(
            target: PropertiesProvider<T>,
            name  : keyof NoInfer<T>
        ) {

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

    for(const name in values)
        target[name] = values[name]!;

    resumeReactions();
}