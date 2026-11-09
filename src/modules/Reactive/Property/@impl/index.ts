export {ImmutableProperty} from "./Properties/ImmutableProperty";
export {ValueProperty    } from "./Properties/ValueProperty";
export {ComputedProperty } from "./Properties/ComputedProperty";

export {PropertiesRecord}  from "./PropertiesRecord";
export {updateProperties}  from "./Helpers/WithProperties";

export * from "./Helpers/Factories";
export * from "./Helpers/typeguards";
export * from "./Helpers/links";

//=====

import type { Satisfies } from "MWL@2026/modules/@types";
import { PropertyImpl } from "../@contract/";

declare const _: Satisfies<typeof import("."), PropertyImpl>;