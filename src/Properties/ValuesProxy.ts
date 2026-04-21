export const PROXY_TARGET = Symbol();

//TODO: move to types (?).
export type KeysOf<T> = Extract<keyof T, string>;

export type ProxyTarget<T extends Record<string, any>> = {
    get: <K extends KeysOf<T>>(name: K) => T[K];
    set: <K extends KeysOf<T>>(name: K, value: NoInfer<T[K]>, source?: unknown) => void;
}

export type ValuesProxy<
                    P extends Record<string, any> = Record<string, any>,
                    T extends ProxyTarget<P>      = ProxyTarget<P>
                        > = {
    readonly [PROXY_TARGET]: T;
} & P;

export type ValuesProxyCstr<
                            P extends Record<string, any>
    > = new <T extends ProxyTarget<P>>(target: T) => ValuesProxy<P, T>;

// We can't infer properties from ProxyTarget.
export default function createProxyClass<
                            T extends Record<string, any>
                        >(
                            ...keys: readonly (KeysOf<T>)[]
                        ): ValuesProxyCstr<T> {

    class ValuesProxy {
        readonly [PROXY_TARGET]: ProxyTarget<T>;

        constructor(target: ProxyTarget<T>) {
            this[PROXY_TARGET] = target;
        }
    }

    for(let i = 0; i < keys.length; ++i ) {
        const name = keys[i];
        Object.defineProperty(ValuesProxy.prototype, name, {
            enumerable: true,
            get: function (this: ValuesProxy) {
                return this[PROXY_TARGET].get(name);
            },
            set: function(this: ValuesProxy, value: any) {
                return this[PROXY_TARGET].set(name, value, this);
            }
        })
    }

    return ValuesProxy as any;
}

/**/
// tests...
const Value = createProxyClass<{ok: string, count: number}>("ok", "count");

type Props = {
    ok   : string,
    count: number
}

const target = {
    get<K extends KeysOf<Props>>(name: K) { return {} as Props[K] },
    set<K extends KeysOf<Props>>(name: K, value: Props[K]) {},
    foo() {}
}

const values = new Value(target);

values.count
/**/