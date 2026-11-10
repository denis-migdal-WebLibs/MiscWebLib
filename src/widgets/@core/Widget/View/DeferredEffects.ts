import { TaskList, deferredCallback} from "MWL@2026/@exports/browser/scheduler";
import { PropertiesProxy } from "MWL@2026/modules/Collections/Properties/@impl/PropertiesProxy";

import { observe } from "MWL@2026/modules/Observable";
import { PropertiesRenderer } from "MWL@2026/modules/Reactive/PropertiesRenderer";
import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";
import { InferValues, PropertiesFor } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";

export function DeferredEffects<T extends Record<string, Property<any>>>(
    properties: PropertiesProxy<T>,
    renderer  : TaskList
): DeferredEffects<InferValues<T>> {

    const effects = new PropertiesRenderer(properties);
    addProperties(effects, properties);

    observe(properties, deferredCallback(renderer, () => effects.render()));

    return effects;
}

function addProperties<T extends Record<string, Property<any>>>(
                effects   : PropertiesRenderer<InferValues<T>>, 
                properties: PropertiesProxy<T>
            ): asserts effects is DeferredEffects<InferValues<T>> {
    // @ts-expect-error
    effects.properties = properties;
}

export type DeferredEffects<T extends Record<string, any>>
    = PropertiesRenderer<InferValues<T>>
    & {readonly properties: PropertiesProxy<PropertiesFor<T>>};