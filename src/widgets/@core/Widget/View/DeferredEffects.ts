import { TaskList, deferredCallback} from "MWL@2026/@exports/browser/scheduler";
import { PropertiesProxy } from "MWL@2026/modules/Collections/Properties/@impl/PropertiesProxy";

import { observe } from "MWL@2026/modules/Observable";
import { PropertiesRenderer } from "MWL@2026/modules/Reactive/PropertiesRenderer";
import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";
import { InferValues } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";

export function DeferredEffects<T extends Record<string, Property<any>>>(
    properties: PropertiesProxy<T>,
    renderer  : TaskList
): PropertiesRenderer<InferValues<T>> {

    const effects = new PropertiesRenderer(properties);
    observe(properties, deferredCallback(renderer, () => effects.render()));

    return effects;
}