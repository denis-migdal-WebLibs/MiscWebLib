export * from "./observe";
export * from "./trigger";

import type { Satisfies } from "MWL@2026/@types";
import type { ObservableServices } from "MWL@2026/@contracts/Observable";

declare const _: Satisfies<typeof import("."), ObservableServices>;