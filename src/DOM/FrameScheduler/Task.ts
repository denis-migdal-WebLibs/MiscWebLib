import GuardedState from "@/GuardedState";
import scheduler from "./FrameScheduler";
import { NULL_OP } from "@/types";

export default class Task {

    private readonly task = () => this.Requested.leave();
    private readonly _scheduleTask = () => scheduler.scheduleTask(this.task);
    private scheduleTask = this._scheduleTask;

    private readonly Requested = new GuardedState(
                                    this.scheduleTask,
                                    () => this.callback
                                );
    private readonly Suspended = new GuardedState(
        () => {
            this.scheduleTask = NULL_OP;

            if( this.Requested.isInside ) {
                // Requested will not be able to leave.
                scheduler.cancelScheduledTask(this.task);
            }
        },
        () => {
            this.scheduleTask = this._scheduleTask;
            if( this.Requested.isInside )
                this.scheduleTask(); // Requested will be able to leave.
        }
    );

    private readonly callback: () => void;
    constructor(callback: () => void) {
        this.callback = callback;
    }

    schedule() { this.Requested.enter(); }
    cancel  () { this.Requested.cancel(); }

    suspend() { this.Suspended.enter(); }
    resume () { this.Suspended.leave(); }

    executeNow() {
        this.Requested.cancel();
        this.callback();
    }
}