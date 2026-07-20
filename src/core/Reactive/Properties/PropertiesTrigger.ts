import { trigger } from "../Observers/Observable";
import { PropertyController } from "./Property";

class PropertyTrigger {

    readonly pending = new Array<PropertyController<any>>();
    readonly origin  = new Array<unknown>();

    nbBatch = 0;
    beginBatch() {
        ++this.nbBatch;
    }
    finishBatch() {
        if(--this.nbBatch)
            return;
    
        this.executePending();
    }

    executePending() {

        if( this.nbBatch !== 0 )
            return;

        ++this.nbBatch; // prevents re-entry during execution.

        while(this.pending.length) {
            const idx = this.pending.length - 1

            const slots  = this.pending[idx].slots!;
            const origin = this.origin [idx];
            for(let i = 0; i < slots!.length; ++i)
                trigger(slots[i].changeEvent, origin);

            --this.pending.length;
            --this.origin .length;
        }

        --this.nbBatch;
    }

    trigger<T>(target: PropertyController<T>, origin: unknown) {

        ++this.nbBatch; // prevents re-entry during execution.

        const slots = target.slots!; // must be non-null.
        for(let i = slots.length - 1; i >= 0 ; --i)
            trigger(slots[i].staleEvent, origin);

        --this.nbBatch;

        // push it last.
        this.pending.push(target);
        this.origin .push(origin);

        this.executePending();
    }
}

const propertyTrigger = new PropertyTrigger();

export function beginBatch() {
    propertyTrigger.beginBatch();
}
export function finishBatch() {
    propertyTrigger.finishBatch();
}

export function triggerProperty<T>(target: PropertyController<T>, origin: unknown) {
    propertyTrigger.trigger(target, origin)
}