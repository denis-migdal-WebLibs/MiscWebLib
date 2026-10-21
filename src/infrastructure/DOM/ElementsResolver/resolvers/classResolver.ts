import { Cstr } from "MWL@2026/core/types";

export function classResolver<K extends Cstr<HTMLElement>>(klass: K) {
    return (target: HTMLElement) => {

        __ASSERT__(target instanceof klass, `Element mismatch: expecting ${klass.name}, got ${target.constructor.name}`);

        return target;
    }
}