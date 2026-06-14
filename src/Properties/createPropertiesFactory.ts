import { KeysOf } from "@/types/misc";
import createProxyClass, { PROXY_TARGET } from "./ValuesProxy";
import { PropertiesStore } from "./PropertiesStore";
import { Descriptors } from "./Property";
import { Value } from "./PropertyTypes";

export default function createPropertiesFactory<T extends Record<string, any>>(
                                                    descriptors: Descriptors<T>
                                                ) {

    const Proxy = createProxyClass<T>(...Object.keys(descriptors) as KeysOf<T>[]);

    return (initialValues: Partial<T> = {}) => {

        const store = new PropertiesStore(descriptors, Proxy);

        store.updateProperties(initialValues);

        return store.mainProxy;
    }
}

/**/
const c = createPropertiesFactory({foo: Value(34)});

const p = c();
const v = p[PROXY_TARGET];

void v;