import { InferValues, PropertiesDescriptors } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";
import { PropertiesProxy } from "./@types/def";
import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";

export interface PropertiesDetails {

    // D is required for correct Descriptors type (capture the this).
        // -> rebuild this with Property/WritableProp
        // -> set this as empty ?
    // T is required to properly infer values.
    Properties<
        T extends Record<string,any>, D extends PropertiesDescriptors<T>
            >(desc: D & PropertiesDescriptors<T>): {

            new(initVals?: Partial<InferValues<NoInfer<T>>>): PropertiesProxy<T>;

            readonly Descriptors: D
        };
    properties<T extends Record<string, Property<any>>>(
                                    desc     : PropertiesDescriptors<T>,
                                    initVals?: Partial<InferValues<NoInfer<T>>>
                                ): PropertiesProxy<T>;
}

export interface PropertiesContract extends PropertiesDetails {

}