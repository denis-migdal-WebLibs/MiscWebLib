import { PROPERTY_NODE, PropertyController } from "./Property";
import { FIRST_PROPERTY_CHANGE_ORIGIN, ON_PROPERTY_CHANGE, PropertyHost } from "./PropertyHolder";

class PropertyTrigger {

    readonly pending = new Array<PropertyHost>();

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
            const host = this.pending[this.pending.length - 1];
            host[ON_PROPERTY_CHANGE](host[FIRST_PROPERTY_CHANGE_ORIGIN]);
            // re-entry is forbidden, so this is ok.
            host[FIRST_PROPERTY_CHANGE_ORIGIN] = undefined;
            --this.pending.length;
        }

        --this.nbBatch;
    }

    trigger<T>(target: PropertyController<T>, origin: unknown) {

        const resolvedHost = target[PROPERTY_NODE]!.resolvedHost; // must be non-null.

        let offset = this.pending.length;
        this.pending.length += resolvedHost.length;
        for(let i = resolvedHost.length - 1; i >= 0; --i) {

            const host = resolvedHost[i];

            if( host[FIRST_PROPERTY_CHANGE_ORIGIN] !== undefined )
                continue;

            host[FIRST_PROPERTY_CHANGE_ORIGIN] = origin;
            this.pending[offset++] = host;
        }
        this.pending.length = offset;
        
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