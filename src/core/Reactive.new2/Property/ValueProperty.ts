import { ValueProperty } from "MWL@2026/core/Property.new";
import { requestReaction } from "MWL@2026/core/Reactive.new/Scheduler";
import { ReactiveMixin } from "MWL@2026/core/Reactive.new/Scheduler/@services/ReactiveObject";

type Cstr<T = object> = new (...args: any[]) => T;

type GetHooks<T extends Cstr> = {
    [K in keyof T as K extends `on${Capitalize<string>}` ? K : never]:
        T[K] extends (...args: infer Args) => infer R
            ? (this: InstanceType<T>, ...args: Args) => R
            : never;
}

function mix<
            Base   extends Cstr,
            Result extends Cstr,
        >(
            base : Base,
            mixin: (base: Base) => Result,
            hooks: Partial<GetHooks<Result>>
        ): Result {

    const result = mixin(base);
    Object.assign(result, hooks);

    return result;
}

//TODO: link - set src...
export const ReactiveValue = mix(ValueProperty, ReactiveMixin, {
    onChange() {
        requestReaction(this);
    },
});