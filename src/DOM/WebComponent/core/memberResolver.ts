export type MemberType<
                    T extends object|void,
                    K extends string|symbol
                >
    = K extends keyof T ? T[K] : void;

export function getMember<
                            T extends object|void,
                            K extends string|symbol
                        > (
                            target: T,
                            key   : K
                        ) : MemberType<T, K> {

    if( target === undefined )
        return undefined as any;

    // @ts-ignore
    return target[key];
}