import {PropertySlot} from "./PropertySlot";

export type PropertyObserver<T> = {
    onTrigger: (slot: PropertySlot<T>) => void;
    onNotify : (slot: PropertySlot<T>) => void;
}

export class NotifyGate<T> implements PropertyObserver<T> {
    pendingCount = 0;

    readonly callback;
    constructor(callback: (slot: PropertySlot<T>) => void) {
        this.callback = callback;
    }
    
    onTrigger() {
        ++this.pendingCount;
    }
    onNotify(slot: PropertySlot<T>) {
        if( --this.pendingCount === 0 )
            this.callback(slot);
    }
}

export class TriggerGate<T> implements PropertyObserver<T> {
    pendingCount = 0;

    readonly callback;
    constructor(callback: (slot: PropertySlot<T>) => void) {
        this.callback = callback;
    }
    
    onTrigger(slot: PropertySlot<T>) {
        if( ++this.pendingCount === 1)
            this.callback(slot);
    }
    onNotify() { --this.pendingCount; }
}