import { ObservableObject } from "MWL@2026/modules/Observable/@contract/@types/def";
import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";

import { InferValues, PropertiesFor } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";
import { WithProperties } from "MWL@2026/modules/Reactive/Property/@contract/@types/WithProperties";

export type PropertiesProxy<T extends Record<string, Property<any>>>
    = WithProperties<T> & InferValues<T> & ObservableObject;

export type Properties<T extends Record<string, any>>
    = WithProperties<PropertiesFor<T>> & T & ObservableObject;