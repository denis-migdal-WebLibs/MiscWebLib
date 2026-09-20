import { FCT_ID } from "MWL@2026/@exports/types";

export type ModelViewProvider<T extends object, SubModel = T> = (o: T) => SubModel;

export function getModelViewFactory<
                    T extends object,
                    SubModel = T
                >(factory: ModelViewProvider<T, SubModel>|undefined) {

    if( factory !== undefined )
        return factory;

    return FCT_ID as any;
}
