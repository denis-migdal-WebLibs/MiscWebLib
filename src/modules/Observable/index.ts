import { ObservableContract } from "MWL@2026/@contracts/Observable";

export * from "MWL@2026/@contracts/Observable/@types";
export * from "MWL@2026/@contracts/Observable/services";

export { ObservationController } from "./ObservationController";
export * from "./extensions";

import type { Satisfies } from "MWL@2026/@types";

declare const _: Satisfies<typeof import("."), ObservableContract>;