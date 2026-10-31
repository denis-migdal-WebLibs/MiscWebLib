export {ObservableObjectExtension} from "./ObservableObject";
export {createHookExtension, createOwnedHookExtension, hookFactoryExtension} from "./Hooks";


import type { Satisfies } from "MWL@2026/modules/@types";
import { DefineExtensionsModule } from "MWL@2026/modules/@types/contracts";

import type { Extensions } from "..";

declare const _: Satisfies<
                            typeof import("."),
                            DefineExtensionsModule<Extensions>
                        >;