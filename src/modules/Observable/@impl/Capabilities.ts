import { CALLBACKS, setCallbacks } from "MWL@2026/modules/Callbacks/@contract/@types/WithCallbacks";
import { ObservableDetails } from "../@contract";
import { WithCapabilities } from "../@contract/@types/Capabilities";
import { CallbackList, WithCallbacks } from "MWL@2026/modules/Callbacks";

// API...

export const listen: ObservableDetails["listen"]
    = function(target, callback) {
        resolveCallbacks(target).add(callback);
    }

export const unlisten: ObservableDetails["unlisten"]
    = function(target, callback) {

        const callbacks = getCallbacks(target);
        if( callbacks === null )
            return;

        callbacks.remove(callback);
    }

export const observe: ObservableDetails["observe"]
    = function(target, callback) {
        listen(target, callback);
        callback();
    }

export const unobserve = unlisten;

export const isListening: ObservableDetails["isListening"]
    = function(target, callback) {
        
        const callbacks = getCallbacks(target);
        if( callbacks === null )
            return false;

        return callbacks.has(callback);
    }

export const trigger: ObservableDetails["trigger"]
    = function(target, ...args) {
        const callbacks = getCallbacks(target);
        if( callbacks === null )
            return;

        callbacks.trigger(...args);
    }

export const triggerDrain: ObservableDetails["triggerDrain"]
    = function(target, ...args) {

        const callbacks = getCallbacks(target);
        if( callbacks === null )
            return;

        callbacks.trigger(...args);
        callbacks.clear();
    }

export const canSkipTrigger: ObservableDetails["canSkipTrigger"]
    = function(target) {

        const callbacks = getCallbacks(target);
        if( callbacks === null )
            return true;

        return callbacks.isEmpty;
    }

export const clear: ObservableDetails["clear"]
    = function(target) {

        const callbacks = getCallbacks(target);
        if( callbacks === null )
            return;

        callbacks.clear();
    }

//////
// Helpers
//////

function getCallbacks<T extends WithCapabilities<any[], any>>(target: T): T[CALLBACKS] {
    return target[CALLBACKS];
}

function resolveCallbacks<T extends WithCapabilities<any[], any>>(target: T): NonNullable<T[CALLBACKS]> {
    let callbacks = target[CALLBACKS];
    if( callbacks === null) {
        callbacks = new CallbackList();
        setCallbacks(target as WithCallbacks, callbacks as CallbackList);
    }

    return callbacks;
}