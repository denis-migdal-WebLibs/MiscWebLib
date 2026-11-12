import { PropertiesRecord } from "MWL@2026/modules/Reactive/Property";
import { PropertiesDetails } from "../@contract";
import { PropertiesProxy } from "./PropertiesProxy";
import { Property } from "MWL@2026/modules/Reactive/Property/@contract/@types/def";
import { InferValues, PropertiesDescriptors } from "MWL@2026/modules/Reactive/Property/@contract/@types/PropertiesRecord";
import {Properties} from "../@contract/@types/def";

export const properties: PropertiesDetails["properties"]
    = function (desc, initVals) {
        return new PropertiesProxy( new PropertiesRecord(desc, initVals) ) as any;
    };

const Properties: PropertiesDetails["Properties"]
    = function <T extends Record<string, Property<any>>>(desc: PropertiesDescriptors<T>) {
        return class extends PropertiesProxy<T> {
            constructor(initVals?: Partial<InferValues<NoInfer<T>>>) {
                super( new PropertiesRecord(desc, initVals)  );
            }

            static readonly Descriptors = desc;
        } as any;
    };

export {Properties};