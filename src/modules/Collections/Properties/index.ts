export {Properties, properties} from "./@impl/Properties";

import type { Satisfies } from "MWL@2026/modules/@types";
import { PropertiesContract } from "./@contract/";

declare const _: Satisfies<typeof import("."), PropertiesContract>;
