import { getProperties, PropertiesProvider } from "MWL@2026/core/Reactive/PropertySystem/Properties/PropertiesProvider";
import { TaskList } from "../../FrameScheduler/TaskList";
import { deferredObserve } from "../../FrameScheduler/defer/deferredObserve";
import { PropertiesEffects } from "MWL@2026/core/Reactive/PropertySystem/Properties/PropertiesEffects";

export function DeferredEffects<T extends Record<string, any>>(
    properties: PropertiesProvider<T>,
    renderer  : TaskList
): PropertiesEffects<T> {

    properties = getProperties(properties);

    const propsRenderer = new PropertiesEffects<T>(properties);

    deferredObserve(properties, renderer, () => propsRenderer.render());

    return propsRenderer;
}