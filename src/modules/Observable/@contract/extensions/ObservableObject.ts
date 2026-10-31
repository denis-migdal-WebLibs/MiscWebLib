import { Extensions } from "..";
import { OBS_CTRLER } from "../@types/ctrler";
import { ObservableCtx } from "../@types/def";

export const ObservableObjectExtension: Extensions["ObservableObject"]
    = function(ObsCtrler) {

        return class ObservableObject<CallbackArgs extends any[] = []> {

            readonly [OBS_CTRLER] = new ObsCtrler<
                                                ObservableCtx<this>,
                                                CallbackArgs
                                            >({invoker: this});
        }
    }