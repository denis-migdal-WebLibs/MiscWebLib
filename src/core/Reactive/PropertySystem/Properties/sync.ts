import { bind } from "../Property/sync/bind";
import { forward } from "../Property/sync/forward";
import { KEYS, PROPERTIES } from "./PropertiesImpl";
import { getProperties, getProperty, PropertiesProvider } from "./PropertiesProvider";

/*
type Mapping<S, D> = {
  [K in keyof S]?: {
    [P in keyof D]:
      S[K] extends D[P] ? Extract<P, string> : never
  }[keyof D]
};
*/

type MAP<T extends Record<string, any>, U extends Record<string, any>> = readonly [keyof T, keyof U][];

/*
// ChatGPT
type Equal<A, B> =
  [A] extends [B]
    ? [B] extends [A]
      ? true
      : false
    : false;

// ChatGPT
type MAP<
  T extends Record<string, any>,
  U extends Record<string, any>
> = readonly {
  [K in keyof T]: {
    [P in keyof U]:
      Equal<T[K], U[P]> extends true
        ? readonly [K, P]
        : never
  }[keyof U]
}[keyof T][];
*/

export function bindProperties<
                        T extends Record<string, any>,
                        U extends Record<string, any>
                    >(
                        src    : PropertiesProvider<T>,
                        dst    : PropertiesProvider<U>,
                        mapping: MAP<NoInfer<T>, NoInfer<U>>
                    ) {

    for(let i = 0; i < mapping.length; ++i) {
        const srcProp = getProperty(src, mapping[i][0]);
        const dstProp = getProperty(dst, mapping[i][1]);
        bind(srcProp, dstProp);
    }
}

  export function forwardProperties<
      T extends Record<string, any>
  >(
      src     : PropertiesProvider<T>,
      dst     : PropertiesProvider<NoInfer<T>>,
  ): void
  export function forwardProperties<
      T extends Record<string, any>,
      U extends Record<string, any>
  >(
      src     : PropertiesProvider<T>,
      dst     : PropertiesProvider<U>,
      mapping?: MAP<NoInfer<T>, NoInfer<U>>
  ): void
export function forwardProperties<
                        T extends Record<string, any>,
                        U extends Record<string, any>
                    >(
                        src     : PropertiesProvider<T>,
                        dst     : PropertiesProvider<U>,
                        mapping?: MAP<NoInfer<T>, NoInfer<U>>
                    ) {

    if( mapping === undefined) {
      const keys     = getProperties(src)[KEYS];
      const srcProps = getProperties(src)[PROPERTIES];
      for(let i = 0; i < keys.length; ++i) {
        const dstProp = getProperty(dst, keys[i]);
        if( dstProp.isRO ) continue;
        forward(srcProps[i], dstProp);
      }
      return;
    }

    for(let i = 0; i < mapping.length; ++i) {
        const srcProp = getProperty(src, mapping[i][0]);
        const dstProp = getProperty(dst, mapping[i][1]);
        forward(srcProp, dstProp);
    }
}

/*
type MAPPED<T extends Record<number, string|[string, string]>> = {
    [K in keyof T]: T[K] extends string           ? [T[K], T[K]]
                  : T[K] extends [string, string] ? [T[K][0], T[K][1]]
                                                  : never;
}
*/

type UNMAP<T extends readonly [string,string][]> = readonly (T[number] extends [T[number][0], T[number][1]] ? T[number][0] | T[number] : T[number])[];

//type T = UNMAP<(["e", "f"]|["e", "e"])[]>;
//type INTER<T, U> = T extends U ? T : U;

export function map<
            const R extends readonly [string, string][],
            //const T extends readonly (string|[string, string])[] = UNMAP<R>
        >(...keys: UNMAP<R>)
                    : R {

    const map = new Array(keys.length);

    for(let i = 0; i < keys.length; ++i) {
        if( typeof keys[i] === "string")
            map[i] = [keys[i], keys[i]];
        else
            map[i] = keys[i];
    }

    return map as any;
}