import { getProperties, PropertiesProvider } from "MWL@2026/core/Reactive/PropertySystem/Properties/PropertiesProvider";

import { TaskList, deferredCallback} from "MWL@2026/exports/browser/scheduler";

import { PropertiesEffects } from "MWL@2026/core/Reactive/PropertySystem/Properties/PropertiesEffects";
import { observe } from "MWL@2026/exports/Reactive/Observable";

export function DeferredEffects<T extends Record<string, any>>(
    properties: PropertiesProvider<T>,
    renderer  : TaskList
): PropertiesEffects<T> {

    properties = getProperties(properties);

    const effects = new PropertiesEffects<T>(properties);
    observe(properties, deferredCallback(renderer, () => effects.render()));

    return effects;
}