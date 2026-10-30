import { Observable } from "MWL@2026/@contracts/Observable/@types/def";
import { OBS_CTRLER } from "MWL@2026/@contracts/Observable/@types/internals";

/** TODO: remove... */
export class ObservableProxy<
                                This extends object|void = void,
                                Args extends any[] = []
                            > implements Observable<This, Args> {

    readonly [OBS_CTRLER]: Observable<This, Args>[OBS_CTRLER];

    constructor(target: Observable<This, Args>) {
        this[OBS_CTRLER] = target[OBS_CTRLER];
    }
}