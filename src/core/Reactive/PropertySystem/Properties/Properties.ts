import { NULL_OBJ } from "MWL@2026/exports/types";
import { PPDescriptor, PropertiesDescriptors } from "./PropertiesImpl";
import { Properties as TProperties, PropertiesImpl } from "./PropertiesImpl";

export function PropertiesFactory<PD extends PropertiesDescriptors<any>>(
                        descriptors  : PD & PropertiesDescriptors<PropertiesType<PD>>
                    ) {

    return (
            initialValues: Partial<PropertiesType<PD>> = NULL_OBJ
        ): TProperties<PropertiesType<PD>> => {
            return  new PropertiesImpl(descriptors, initialValues) as           TProperties<PropertiesType<PD>>;
    }
}

function Properties<PD extends PropertiesDescriptors<any>>(
                        descriptors  : PD & PropertiesDescriptors<PropertiesType<PD>>,
                        initialValues: Partial<NoInfer<PropertiesType<PD>>> = NULL_OBJ
                    ) {
    return new PropertiesImpl(descriptors, initialValues) as TProperties<PropertiesType<PD>>;
}
type Properties<T extends Record<string, any>> = TProperties<T>;

export {Properties};

//TODO: move 2 types
type Expand<T> = T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

export type PropertiesType<T extends PropertiesDescriptors<any>> = Expand<{
    [K in keyof T as ReturnType<T[K]> extends {set(value: any): void}
                            ? K
                            : never]: T[K] extends PPDescriptor<any, infer U> ? U : never;
} & {
    readonly [K in keyof T]: T[K] extends PPDescriptor<any, infer U> ? U : never;
}>;