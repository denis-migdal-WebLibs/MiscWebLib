import { Cstr } from "MWL@2026:core/types";

export function classResolver<K extends Cstr<HTMLElement>>(klass: K) {
    return (target: HTMLElement) => {

        if( __DEBUG__ && ! (target instanceof klass) )
            // @ts-ignore
            throw new Error(`Element mismatch: expecting ${klass.name}, got ${target.constructor.name}`);

        return target;
    }
}