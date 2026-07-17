import { MAIN_EVENT } from "MWL@2026:Reactive/Observers/EventSource";
import { PropertiesDescriptors } from "./Property";
import { createPropertiesFactory, Properties } from "./createProperties";
import { Event } from "MWL@2026:Reactive/Event";

export type WithProperties<T extends Record<string, any>> = {
    readonly properties  : Properties<T>;
    readonly [MAIN_EVENT]: Event<Properties<T>>;
}

export function WithProperties<T extends Record<string, any>>(
                                    descriptors: PropertiesDescriptors<T>
                                ) {

    const propertiesFactory = createPropertiesFactory(descriptors);

    return class WithProperties {

        readonly properties  : Properties<T>;
        readonly [MAIN_EVENT]: Event<Properties<T>>;

        constructor(initialValues: Partial<T> = {}) {
            this.properties = propertiesFactory(initialValues);
            this[MAIN_EVENT] = this.properties[MAIN_EVENT];
        }
    }
}