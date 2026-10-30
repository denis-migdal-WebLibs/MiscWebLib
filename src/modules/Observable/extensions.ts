import { ObservableExtensions } from "MWL@2026/@contracts/Observable";
import { ObservationController } from "./ObservationController";

// ==================

import { hookFactoryExtension, ObservableObjectExtension } from "MWL@2026/@contracts/Observable/extensions";
import { createHookExtension, createOwnedHookExtension } from "MWL@2026/@contracts/Observable/extensions";


export const ObservableObject = ObservableObjectExtension(ObservationController);

export const createHook = createHookExtension(ObservationController);
export const createOwnedHook = createOwnedHookExtension(ObservationController);
export const hookFactory = hookFactoryExtension(ObservationController);


// ==================

import type { Satisfies } from "MWL@2026/@types";

declare const _: Satisfies<typeof import("."), ObservableExtensions>;