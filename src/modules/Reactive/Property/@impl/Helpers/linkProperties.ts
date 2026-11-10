import { pauseReactions, resumeReactions } from "MWL@2026/modules/Reactive/Reaction";
import { PropertyDetails } from "../../@contract";
import { PROPERTIES } from "../../@contract/@types/WithProperties";
import { forwardValue, syncValue } from "./links";
import { ValueProperty } from "../Properties/ValueProperty";

export const forwardProperties: PropertyDetails["forwardProperties"]
    = function (src, dst, mappings) {

        const srcRecord = src[PROPERTIES];
        const dstRecord = dst[PROPERTIES];

        pauseReactions(...dstRecord.properties);

        for(let i = 0; i < mappings.length; ++i) {

            const srcProp = srcRecord.get(mappings[i][0] as any);
            const dstProp = dstRecord.get(mappings[i][1] as any) as unknown as ValueProperty<any>;

            forwardValue(srcProp, dstProp);
        }

        resumeReactions(...dstRecord.properties);
    }

export const syncProperties: PropertyDetails["syncProperties"]
    = function (src, dst, mappings) {

        const srcRecord = src[PROPERTIES];
        const dstRecord = dst[PROPERTIES];

        // no needs to pause srcRecord (values are pushed to dst).
        pauseReactions(...dstRecord.properties);

        for(let i = 0; i < mappings.length; ++i) {

            const srcProp = srcRecord.get(mappings[i][0] as any) as unknown as ValueProperty<any>;;
            const dstProp = dstRecord.get(mappings[i][1] as any) as unknown as ValueProperty<any>;

            syncValue(srcProp, dstProp);
        }

        resumeReactions(...dstRecord.properties);
    }