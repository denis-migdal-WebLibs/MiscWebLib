export const IMPL_TYPE = Symbol();
export type  IMPL_TYPE = typeof IMPL_TYPE;

export type Impl<T extends WithImpl<any>> = Exclude<T[IMPL_TYPE], undefined>;

export type WithImpl<T extends object> = {[IMPL_TYPE]?: T};

export function impl<T extends WithImpl<any>>(o: T): Impl<T> {
    return o as any;
}

export function asImpl<T extends object|null|undefined>(o: T): T extends WithImpl<any> ? Impl<T> : T {
    return o as any;
}