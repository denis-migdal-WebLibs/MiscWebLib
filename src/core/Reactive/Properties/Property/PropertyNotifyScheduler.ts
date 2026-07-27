import { PropertyController } from "./PropertyController";

class PropertyNotifyScheduler {

    collectedNotification = new Array<PropertyController<any>>();
    queuedNotification    = new Array<PropertyController<any>>();

    lock = 0;
    enterBatch() {
        ++this.lock;
    }
    leaveBatch() {
        --this.lock;
        
        if( this.lock === 0 )
            this.flush();
    }

    flush() {

        ++this.lock; // prevents re-entry during execution.

        // can run many cycles...
        while( this.collectedNotification.length !== 0 ) {

            const queue = this.collectedNotification;
            this.collectedNotification = this.queuedNotification;
            this.queuedNotification    = queue;

            for(let i = 0; i < queue.length; ++i) {
                const pending = queue[i];
                
                const slots  = pending.node.slots;
                for(let i = 0; i < slots.length; ++i)
                    slots[i].notify();

                // because re-entry in notifications is forbidden.
                pending.node.notificationOrigin = undefined;
            }

            queue.length = 0;
        }

        --this.lock;
    }

    trigger<T>(target: PropertyController<T>, origin: unknown) {

        const curOrigin = target.node.notificationOrigin;
        target.node.notificationOrigin = origin;

        // already triggered.
        if( curOrigin !== undefined)
            return;

        this.enterBatch(); // prevents re-entry during trigger.

        // collect.
        this.collectedNotification.push(target);

        const slots = target.node.slots; // must be non-null.
        for(let i = slots.length - 1; i >= 0 ; --i)
            slots[i].trigger();

        this.leaveBatch();
    }
}

const notifyScheduler = new PropertyNotifyScheduler();

export function enterNotificationBatch() {
    notifyScheduler.enterBatch();
}
export function leaveNotificationBatch() {
    notifyScheduler.leaveBatch();
}

export function triggerProperty<T>(target: PropertyController<T>, origin: unknown) {
    notifyScheduler.trigger(target, origin)
}