import { enterNotificationBatch, leaveNotificationBatch } from "../Property/PropertyNotifyScheduler";
import { CONTROLLERS, Properties } from "./PropertiesImpl";
import { WithProperties } from "./WithProperties";

export type PropertiesProvider<T extends Record<string, any>>
    = Properties<T>|WithProperties<T>;

export function getProperties<T extends Record<string, any>>(
                                        target: PropertiesProvider<T>,
                                    ): Properties<T> {
                                        
    const properties = target.properties;
    if( properties !== undefined )
        return properties;

    return target as Properties<T>;
}


export function getProperty<T extends Record<string, any>>(
            target: PropertiesProvider<T>,
            name  : keyof NoInfer<T>
        ) {
    target = getProperties(target);

    return target[CONTROLLERS][name];
}

export function getPropertyController<T extends Record<string, any>>(
            target: PropertiesProvider<T>,
            name  : keyof NoInfer<T>
        ) {
    target = getProperties(target);

    return target[CONTROLLERS][name].controller;
}

export function updateProperties<T extends Record<string, any>>(
                                        target: PropertiesProvider<T>,
                                        values: Partial<T>,
                                        origin: unknown = null
                                    ) {

    target = getProperties(target);
    
    enterNotificationBatch();

    for(const name in values)
        target[CONTROLLERS][name].set(values[name]!, origin);

    leaveNotificationBatch();
}