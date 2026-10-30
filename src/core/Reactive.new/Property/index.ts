import { ImmutablePropertyClass, ValuePropertyClass } from "./@contract";
import { ImmutablePropertyImpl } from "./@details/Properties/ImmutableProperty";
import { ValuePropertyImpl } from "./@details/Properties/ValueProperty";

import { ValueProperty as ValuePropertyContract} from "./@contract";

export const ImmutableProperty: ImmutablePropertyClass = ImmutablePropertyImpl;

export const ValueProperty: ValuePropertyClass = ValuePropertyImpl;
export type  ValueProperty<T> = ValuePropertyContract<T>;

export {forwardValue, syncValue} from "./@details/Links/ValueLinks";