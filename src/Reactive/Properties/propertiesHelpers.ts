import { CONTROLLERS, Properties } from "./createProperties";
import { beginBatch, finishBatch } from "./PropertiesTrigger";
import { PropertiesControllers, PropertyController } from "./Property";
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

export function getPropertyController<T extends Record<string, any>>(
            target: PropertiesProvider<T>,
            name  : keyof NoInfer<T>
        ) {
    target = getProperties(target);

    return target[CONTROLLERS][name].property;
}

export function updateProperties<T extends Record<string, any>>(
                                        target: PropertiesProvider<T>,
                                        values: Partial<T>,
                                        origin: unknown = null
                                    ) {

    target = getProperties(target);
    
    beginBatch();

    for(const name in values)
        target[CONTROLLERS][name].set(values[name]!, origin);

    finishBatch();
}

export function validate<T>(property: PropertyController<T>) {

    if( property.validate === undefined )
        return;

    const result = property.validate();
    if( result === true )
        return;

    throw new Error(`Validation "${result.validation}" failed on property (?): got ${JSON.stringify(result.value)}.`);
}


export function getStamp<T extends Record<string, any>>(properties: Readonly<T>, key: keyof T) {

    // @ts-ignore
    const crtler = properties[CONTROLLERS] as undefined
                                             |PropertiesControllers<T>;

    if( crtler !== undefined )
        return crtler[key].stamp;

    return properties[key];
}