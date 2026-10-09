import { hasKey } from "MWL@2026/@exports/types";
import { InferPropertiesShape, Properties } from "../@contrat";
import { getPropertiesNames, getPropertyFromIdx, pausePropertiesReactions, resumePropertiesReactions } from "../@details/PropertiesOperations";
import { isWritable } from "MWL@2026/core/Reactive.new/Property/@details/Properties/ValueProperty";

export function updateProperties<T extends Properties<Record<string, any>>>(
                                target: T,
                                //& PropertiesProvider<Record<string, any>>,
                                values: Partial<InferPropertiesShape<T>>
                            ) {
    
    pausePropertiesReactions(target);

    const names = getPropertiesNames(target);
    for(let i = 0; i < names.length; ++i) {

        const name     = names[i];
        const property = getPropertyFromIdx(target, i);

        // useful when importing data.
        // we could also check wether the properties are identical,
        // but not practical when using View()
        if( ! isWritable(property) || ! hasKey(values, name) ) continue;

        property.set(values[name]);
    }

    resumePropertiesReactions(target);
}

