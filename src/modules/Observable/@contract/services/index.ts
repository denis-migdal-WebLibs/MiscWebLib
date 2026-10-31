export * from "./observe";
export * from "./trigger";

import type { Satisfies } from "MWL@2026/modules/@types";
import type { ObservableServices } from "..";

declare const _: Satisfies<typeof import("."), ObservableServices>;