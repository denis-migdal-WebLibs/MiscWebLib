import createPropertiesFactory from "./createPropertiesFactory"
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