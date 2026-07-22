import { getProperties, PropertiesProvider, PropertiesRenderer } from "MWL@2026:exports/Reactive/Properties";
import TaskList from "../TaskList";
import { deferredObserve } from "./deferredObserve";

export default function createPropertiesDeferredRenderer<T extends Record<string, any>>(
    properties: PropertiesProvider<T>,
    renderer  : TaskList
) {

    const props         = getProperties(properties);
    // I guess TS have difficulties to properly infer type here:
    const propsRenderer = new PropertiesRenderer<T>(props);

    deferredObserve(properties, renderer, () => propsRenderer.render());

    return propsRenderer;
}