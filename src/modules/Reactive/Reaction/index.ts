export * from "./@impl";

import type { Satisfies } from "MWL@2026/modules/@types";
import { ReactionContract } from "./@contract/";

declare const _: Satisfies<typeof import("."),
                            ReactionContract<any>>;