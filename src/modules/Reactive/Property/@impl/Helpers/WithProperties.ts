import { pauseReactions, resumeReactions } from "MWL@2026/modules/Reactive/Reaction";
import { PropertyDetails } from "../../@contract";
import { PROPERTIES } from "../../@contract/@types/WithProperties";
import { isWritable } from "./typeguards";

export const updateProperties: PropertyDetails["updateProperties"]
    = function(target, values) {

        const record = target[PROPERTIES];

        pauseReactions(...record.properties);

        const keys = record.keys;
        for(let i = 0; i < keys.length; ++i) {

            const key = keys[i];

            // we browse by keys in case values has extra keys.
            if( ! (key in values) )
                continue;

            const property = record.properties[i];

            if( ! isWritable(property) )
                continue;
            
            property.set( values[key] );
        }

        resumeReactions(...record.properties);
    };