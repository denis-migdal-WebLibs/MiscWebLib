import { ObservableExtensions } from "MWL@2026/modules/Observable/@contract";
import { ObservationController } from "./ObservationController";

// ==================

import { hookFactoryExtension, ObservableObjectExtension, createHookExtension, createOwnedHookExtension } from "MWL@2026/modules/Observable/@contract/extensions";

export const ObservableObject = ObservableObjectExtension(ObservationController);

export const createHook = createHookExtension(ObservationController);
export const createOwnedHook = createOwnedHookExtension(ObservationController);
export const hookFactory = hookFactoryExtension(ObservationController);

// ==================

import type { Satisfies } from "MWL@2026/modules/@types";

declare const _: Satisfies<typeof import("."), ObservableExtensions>;