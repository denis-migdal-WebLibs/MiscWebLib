import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";

import { InferValues, PropertiesFor } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";
import { WithProperties } from "MWL@2026/modules/Reactive/Property/@contract/@types/WithProperties";
import { ReactiveObject } from "MWL@2026/modules/Reactive/Reaction";

export type PropertiesProxy<T extends Record<string, Property<any>>>
    = WithProperties<T> & InferValues<T> & ReactiveObject;

export type Properties<T extends Record<string, any>>
    = WithProperties<PropertiesFor<T>> & T & ReactiveObject;

export type PropertiesCstr<T extends Record<string, any>> = {
        new(initialValues?: Partial<T>): Properties<T>;
    }