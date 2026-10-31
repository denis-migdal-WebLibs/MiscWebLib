// The symbol is part of the interface:
// Many systems MAY coexist.
// The API is made of services (~ function => internal method redirections).
// Allows you to create your own objects that are compatible with the API.
// Details/Extensions create such objects, but aren't exclusive.

const OBS_CTRLER = Symbol();
type  OBS_CTRLER = typeof OBS_CTRLER;

export {OBS_CTRLER};

export type ObservableWith<T extends object> = {
    readonly [OBS_CTRLER] : T;
}

// Used to make features independent of how they are stored.
export function obsCtrler<
                    T extends ObservableWith<object>
                > (target: T): T[OBS_CTRLER] {
    return target[OBS_CTRLER];
}