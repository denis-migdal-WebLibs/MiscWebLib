import { ObservableServices } from "..";
import { obsCtrler } from "../@types/ctrler";

export const clear: ObservableServices["clear"]
    = function(target) {
        obsCtrler(target).clear();
    }

export const trigger: ObservableServices["trigger"]
    = function(target, ...args) {
        obsCtrler(target).trigger(...args);
    }

export const triggerDrain: ObservableServices["triggerDrain"]
    = function(target, ...args) {
        trigger(target, ...args);
        clear(target);
    }

export const canSkipTrigger: ObservableServices["canSkipTrigger"]
    = function(target) {
        return obsCtrler(target).canSkipTrigger();
    }