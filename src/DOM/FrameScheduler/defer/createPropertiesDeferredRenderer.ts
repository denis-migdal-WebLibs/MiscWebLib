import { getProperties, PropertiesProvider } from "MWL@2026:Reactive/Properties/createProperties";
import TaskList from "../TaskList";
import PropertiesRenderer from "MWL@2026:Reactive/Properties/PropertiesRenderer";
import { deferredObserve } from "./deferredObserve";

export default function createPropertiesDeferredRenderer<T extends Record<string, any>>(
    properties: PropertiesProvider<T>,
    renderer  : TaskList
) {

    const props         = getProperties(properties);
    const propsRenderer = new PropertiesRenderer(props);

    deferredObserve(properties, renderer, () => propsRenderer.render());

    return propsRenderer;
}