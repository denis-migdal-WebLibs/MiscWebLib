import { syncProperty } from "../Property/syncProperty";
import { getProperty, PropertiesProvider } from "./PropertiesProvider";

type Mapping<S, D> = {
  [K in keyof S]?: {
    [P in keyof D]:
      S[K] extends D[P] ? Extract<P, string> : never
  }[keyof D]
};

export function syncProperties<
                        T extends Record<string, any>,
                        U extends Record<string, any>
                    >(
                        src    : PropertiesProvider<T>,
                        dst    : PropertiesProvider<U>,
                        mapping: Mapping<NoInfer<T>, NoInfer<U>>
                    ) {

    for(let key in mapping) {
        const srcProp = getProperty(src, key);
        const dstProp = getProperty(dst, mapping[key]!);
        //@ts-ignore: TS is a little lost here.
        syncProperty(srcProp, dstProp);
    }
}