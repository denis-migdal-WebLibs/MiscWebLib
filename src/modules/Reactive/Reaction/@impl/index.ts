export * from "./API";
export * from "./ReactiveObject";

import type { Satisfies } from "MWL@2026/modules/@types";

import { ReactionContract } from "../@contract/";
import type {ReactionNodeExtra} from "./@types";

declare const _: Satisfies<typeof import("."),
                            ReactionContract<ReactionNodeExtra>>;