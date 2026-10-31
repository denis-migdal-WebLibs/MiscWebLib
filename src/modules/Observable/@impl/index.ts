export * from "./extensions";
export { ObservationController } from "./ObservationController";

import type { Satisfies } from "MWL@2026/modules/@types";
import { ObservableImpl } from "../@contract/";

declare const _: Satisfies<typeof import("."), ObservableImpl>;