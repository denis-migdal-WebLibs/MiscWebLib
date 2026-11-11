export * from "./Capabilities";
export {Observable} from "./Observable";

import type { Satisfies } from "MWL@2026/modules/@types";
import { ObservableDetails } from "../@contract/";

declare const _: Satisfies<typeof import("."), ObservableDetails>;