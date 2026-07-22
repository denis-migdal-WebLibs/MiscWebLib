import { PropertyController } from "./PropertyController";

class PropertyNotifyScheduler {

    readonly pendingNotification = new Array<PropertyController<any>>();

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

        while(this.pendingNotification.length) {
            const idx = this.pendingNotification.length - 1;

            const slots  = this.pendingNotification[idx].node.slots;
            for(let i = 0; i < slots.length; ++i)
                slots[i].notify();
            this.pendingNotification[idx].node.notificationOrigin = undefined;

            --this.pendingNotification.length;
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

        const slots = target.node.slots; // must be non-null.
        for(let i = slots.length - 1; i >= 0 ; --i)
            slots[i].trigger();

        // schedule.
        this.pendingNotification.push(target);

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