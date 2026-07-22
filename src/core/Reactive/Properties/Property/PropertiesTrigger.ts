import { trigger } from "MWL@2026:exports/Reactive/Events";
import { PropertyController } from "./Property";

class PropertyTrigger {

    readonly pending = new Array<PropertyController<any>>();

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
            const idx = this.pending.length - 1;

            const node = this.pending[idx].node;

            const slots  = node.slots;
            const origin = node.notificationOrigin;
            for(let i = 0; i < slots!.length; ++i)
                trigger(slots[i].changeEvent, origin);

            node.notificationOrigin = undefined;
            --this.pending.length;
        }

        --this.nbBatch;
    }

    trigger<T>(target: PropertyController<T>, origin: unknown) {

        const curOrigin = target.node.notificationOrigin;
        target.node.notificationOrigin = origin;

        // already triggered.
        if( curOrigin !== undefined)
            return;

        ++this.nbBatch; // prevents re-entry during execution.

        const slots = target.node.slots; // must be non-null.
        for(let i = slots.length - 1; i >= 0 ; --i)
            trigger(slots[i].staleEvent, origin);

        --this.nbBatch;

        // push it last.
        this.pending.push(target);

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