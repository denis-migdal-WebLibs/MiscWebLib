export {ObservableObjectExtension} from "./ObservableObject";
export {createHookExtension, createOwnedHookExtension, hookFactoryExtension} from "./Hooks";


import type { Satisfies } from "MWL@2026/@types";
import { DefineExtensionsModule } from "MWL@2026/@types/Extensions";

import type { Extensions } from "MWL@2026/@contracts/Observable";

declare const _: Satisfies<
                            typeof import("."),
                            DefineExtensionsModule<Extensions>
                        >;