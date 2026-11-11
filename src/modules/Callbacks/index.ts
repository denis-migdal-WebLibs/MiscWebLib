export * from "./@contract/@types";
export * from "./@impl";

import type { Satisfies } from "MWL@2026/modules/@types";
import { CallbacksContract } from "./@contract/";

declare const _: Satisfies<typeof import("."), CallbacksContract>;