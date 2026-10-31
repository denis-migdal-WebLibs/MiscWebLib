export * from "./API";
export * from "./ReactiveObject";

import type { Satisfies } from "MWL@2026/modules/@types";

import { ReactionImpl } from "../@contract/";
import { ReactionNodeImpl } from "./@types";

declare const _: Satisfies<typeof import("."),
                            ReactionImpl<ReactionNodeImpl>>;