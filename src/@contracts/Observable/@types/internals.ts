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