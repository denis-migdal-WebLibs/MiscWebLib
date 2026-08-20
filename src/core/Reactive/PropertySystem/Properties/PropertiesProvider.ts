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



export function setProperties<T extends PropertiesProvider<Record<string, any>>>(
                                        target: T,
                                        //& PropertiesProvider<Record<string, any>>,
                                        values: Partial<PropertiesShape<T>>
                                    ) {
    
    pauseReactions();

    const properties = getProperties(target);

    const keys  = properties[KEYS];
    const props = properties[PROPERTIES];

    for(let i = 0; i < keys.length; ++i) {

        const name = keys [i];
        const prop = props[i];

        // useful when importing data.
        if( prop.isRO )
            continue;
            // we could check that ro are identical,
            // but not practical when using View()

        if( ! (name in values) ) {
            prop.clear();
        } else {
            prop.set(values[name]);
        }
    }

    resumeReactions();
}

export function updateProperties<T extends PropertiesProvider<Record<string, any>>>(
                                        target: T,
                                        //& PropertiesProvider<Record<string, any>>,
                                        values: Partial<PropertiesShape<T>>
                                    ) {
    
    pauseReactions();

    for(const name in values) {

        const prop = getProperty(target, name);

        // useful when importing data.
        if( prop.isRO )
            continue;
            // we could check that ro are identical,
            // but not practical when using View()

        prop.set(values[name]);
    }

    resumeReactions();
}