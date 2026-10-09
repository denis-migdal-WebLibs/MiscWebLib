import { pauseReactions, resumeReactions } from "MWL@2026/core/Reactive.new/Reaction/@details/API";
import { Properties } from "../@contrat";
import { Property } from "MWL@2026/core/Reactive.new/Property/@contract";
import { PROPERTIES, KEYS } from "./Properties";

/////
// Get
/////

//TODO: move some stuff in @services once things are moved into contract.

export function getPropertiesNames<T extends Properties<Record<string, any>>>(target: T): readonly (keyof T)[] {
    // @ts-expect-error
    return target[KEYS];
}

export function getProperty<T extends Record<string, any>, K extends keyof T>(
            target: Properties<T>,
            name  : K
        ): Property<T[K]> {

    // @ts-expect-error
    return getPropertyFromIdx(target[KEYS].indexOf(name as string));
}

export function getPropertyFromIdx<T extends Properties<Record<string, any>>>(target: T, idx: number): Property<unknown> {
    // @ts-expect-error
    return target[PROPERTIES][idx];
}

export function getProperties<T extends Properties<Record<string, any>>>(target: T) {
    // @ts-expect-error
    return target[PROPERTIES];
}

/////
// Reactions
/////

export function pausePropertiesReactions<T extends Record<string, any>>(
            target: Properties<T>,
) {
    pauseReactions(...getProperties(target));
}

export function resumePropertiesReactions<T extends Record<string, any>>(
            target: Properties<T>,
) {
    resumeReactions(...getProperties(target));
}