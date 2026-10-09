import { ImmutablePropertyClass, ValuePropertyClass } from "./@contract";
import { ImmutablePropertyImpl } from "./@details/Properties/ImmutableProperty";
import { ValuePropertyImpl } from "./@details/Properties/ValueProperty";

import { ValueProperty as ValuePropertyContract} from "./@contract";

export const ImmutableProperty: ImmutablePropertyClass = ImmutablePropertyImpl;

const ValueProperty: ValuePropertyClass = ValuePropertyImpl;
type  ValueProperty<T> = ValuePropertyContract<T>;

export {ValueProperty};
export {forwardValue, syncValue} from "./@details/Links/ValueLinks";