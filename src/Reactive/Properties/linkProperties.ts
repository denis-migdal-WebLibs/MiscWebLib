import { observeChanges } from "../Event";
import { PropertiesProxy, updateProperties } from "./PropertiesStore";
import { getProperties, WithProps } from "./WithProperties";

export default function linkProperties<
                        T extends Record<string, any>,
                        U extends Record<string, any>
                    >(
                        src: PropertiesProxy<T>|WithProps<T>,
                        dst: PropertiesProxy<U>|WithProps<U>,
                        map: Partial<Record<keyof NoInfer<T>, keyof NoInfer<U>>>,
                        initial = false
                    ) {

    src = getProperties(src);
    dst = getProperties(dst);

    const data = {} as Partial<U>;
    
    observeChanges(src, function () {
        if( this.origin === dst) return; // prevents re-entry.

        for(const key in map)
            // @ts-ignore
            data[map[key]] = src[key];

        updateProperties(dst, data, src);
    });

    if( initial === true ) {
        for(const key in map)
            // @ts-ignore
            data[map[key]] = src[key];

        updateProperties(dst, data, src);
    }
}

export function syncProperties<
                        T extends Record<string, any>,
                        U extends Record<string, any>
                    >(
                        src: PropertiesProxy<T>|WithProps<T>,
                        dst: PropertiesProxy<U>|WithProps<U>,
                        map: Partial<Record<keyof NoInfer<T>, keyof NoInfer<U>>>
                    ) {

    const reverseMap = {} as Record<keyof U, keyof T>;
    for(const key in map)
        // @ts-ignore
        reverseMap[map[key]] = key;

    linkProperties(src, dst, map, true);
    linkProperties(dst, src, reverseMap);
}