import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";
import { InferValues } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";
import { WithProperties } from "MWL@2026/modules/Reactive/Property/@contract/@types/WithProperties";

export type Renderer = {
    addRule(cond: () => boolean, effect: () => void): void;
    afterRender(after: () => void): void;
    render(): void;
}

export type PropertiesRenderer<T extends Record<string, any>> = {
    addRule(
            keys: readonly Extract<keyof T, string>[],
            effect: () => void
        ): void;
    afterRender(after: () => void): void;
    render(): void;
}

export type PropertiesRendererClass = {
    new<T extends Record<string, Property<any>>>(target: WithProperties<T>): PropertiesRenderer<InferValues<T>>
}