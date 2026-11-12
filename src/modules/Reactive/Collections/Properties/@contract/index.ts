import { InferValues, PropertiesDescriptors } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";
import { PropertiesProxy } from "./@types/def";
import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";

export interface PropertiesDetails {

    Properties<T extends Record<string, Property<any>>>(
                                        desc: PropertiesDescriptors<T>
                                    ): {
            new(initVals?: Partial<InferValues<NoInfer<T>>>): PropertiesProxy<T>;

            // don't we need the this ?
            readonly Descriptors: PropertiesDescriptors<T>
        };
    properties<T extends Record<string, Property<any>>>(
                                    desc     : PropertiesDescriptors<T>,
                                    initVals?: Partial<InferValues<NoInfer<T>>>
                                ): PropertiesProxy<T>;
}

export interface PropertiesContract extends PropertiesDetails {

}