import { Cstr, isClass, NULL_OP } from "MWL@2026:core/types";
import { extractData } from "./extractData";

export type ControllerCstr<
                    C extends object|void,
                    D extends Record<string, any>
                > = C extends void ? never : Cstr<Exclude<C,void>, [Partial<D>]>;

export type ControllerFactory<
                    C extends object|void,
                    D extends Record<string, any>,
                > = (this: HTMLElement, args: Partial<D>) => C;

export type ControllerProvider<
                    C extends object|void,
                    D extends Record<string, any>,
                > = ControllerCstr<C, D> | ControllerFactory<C, D>

export function asControllerFactory<
                    C extends object|void,
                    D extends Record<string, any>,
                >(
                    provider?: ControllerProvider<C, D>
                ): ControllerFactory<C, D> {

    if( provider === undefined )
        return NULL_OP as any;

    if( ! isClass( provider ) )
        return provider;

    return function(this: HTMLElement, data: Partial<D>) {
        data = extractData(this, data);
        return new provider(data) as C;
    }
}