import { PropertiesFactory, PropertiesType } from "./Properties";
import { Properties, PropertiesDescriptors } from "./PropertiesImpl";

import { ObservableProxy } from "MWL@2026/core/Reactive/Observers/Observable";

export type WithProperties<T extends Record<string, any>> = {
    readonly properties  : Properties<T>;
} & T & ObservableProxy<Properties<T>>;

type WithPropertiesCstr<T extends Record<string, any>> = {
    new(initialValues?: Partial<T>): WithProperties<T>
}

export function WithProperties<PD extends PropertiesDescriptors<any>>(
                    descriptors: PD & PropertiesDescriptors<PropertiesType<PD>>
                ): WithPropertiesCstr<PropertiesType<PD>> {

    const Properties = PropertiesFactory(descriptors);

    return class WithProperties
                    extends ObservableProxy<Properties<PropertiesType<PD>>> {

        constructor(initialValues: Partial<PropertiesType<PD>> = {}) {
            // @ts-expect-error
            const properties  = Properties(initialValues);
            super(properties);

            // @ts-expect-error
            this.properties = properties;
        }

        // for clean Object.keys() / JSON.stringify() / structuredClone()
        readonly properties: Properties<PropertiesType<PD>>;

        // for easier access
        static {
            for(const name in descriptors)
                Object.defineProperty(WithProperties.prototype, name, {
                    // not enumerable.
                    set(value: unknown) {
                        this.properties[name] = value;
                    },
                    get() {
                        return this.properties[name];
                    }
                })
        }
    } as WithPropertiesCstr<PropertiesType<PD>>;
}