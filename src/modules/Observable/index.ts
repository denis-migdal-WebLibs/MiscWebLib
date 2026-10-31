export * from "./@contract/@types";
export * from "./@contract/services";

export * from "./@impl";

import type { Satisfies } from "MWL@2026/modules/@types";
import { ObservableContract } from "./@contract/";

declare const _: Satisfies<typeof import("."), ObservableContract>;