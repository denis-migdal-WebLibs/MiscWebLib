import createPropertiesFactory from "./createPropertiesFactory"
import { PropertiesProxy } from "./PropertiesStore";
import { Descriptors } from "./Property"

export default function WithProperties<T extends Record<string, any>>(
                                            descriptors: Descriptors<T>
                                        ) {

    const Properties = createPropertiesFactory(descriptors);

    return class WithProperties {
        readonly properties: ReturnType<typeof Properties>;

        constructor(args: Partial<T> = {}) {
            this.properties = Properties(args);
        }
    }
}

export type WithProps<T extends Record<string, any>> = {
    readonly properties: PropertiesProxy<T>
}

export function getProperties<T extends Record<string, any>>(target: PropertiesProxy<T>|WithProps<T>): PropertiesProxy<T> {

    if( "properties" in target)
        return target.properties;

    return target;
}