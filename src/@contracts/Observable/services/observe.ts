import { ObservableServices } from "..";
import { obsCtrler } from "../@types/internals";

export const listen: ObservableServices["listen"]
    = function(target, callback) {
        obsCtrler(target).add(callback);
    }

export const observe: ObservableServices["observe"]
    = function(target, callback) {
        listen(target, callback);
        obsCtrler(target).call(callback);
    }

export const isListening: ObservableServices["isListening"]
    = function(target, callback) {
        return obsCtrler(target).has(callback);
    }

export const unlisten: ObservableServices["unlisten"]
    = function(target, callback) {
        obsCtrler(target).remove(callback);
    }

export const unobserve = unlisten;