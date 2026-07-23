import { createPropertiesFactory } from "./createProperties";
import { Properties, PropertiesDescriptors } from "./PropertiesImpl";
import { Observable } from "MWL@2026:exports/Reactive/Events";
import { ObservableProxy } from "MWL@2026:core/Reactive/Observers/Observable";

export type WithProperties<T extends Record<string, any>> = {
    readonly properties  : Properties<T>;
} & Observable<Properties<T>>;

export function WithProperties<T extends Record<string, any>>(
                                    descriptors: PropertiesDescriptors<T>
                                ) {

    const propertiesFactory = createPropertiesFactory(descriptors);

    return class WithProperties extends ObservableProxy<Properties<T>> {

        readonly properties  : Properties<T>;

        constructor(initialValues: Partial<T> = {}) {
            const properties  = propertiesFactory(initialValues);
            super(properties);
            this.properties = properties;
        }
    }
}