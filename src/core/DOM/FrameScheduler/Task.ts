import GuardedState from "MWL@2026/core/GuardedState";
import { NULL_OP }  from "MWL@2026/core/types";

import {frameScheduler} from "./FrameScheduler";

export class Task {

    private readonly task          = () => this.Requested.leave();
    private readonly _scheduleTask = () => frameScheduler.scheduleTask(this.task);
    private scheduleTask = this._scheduleTask;

    private readonly Requested = new GuardedState(
                                    this.scheduleTask,
                                    () => this.callback()
                                );
    private readonly Suspended = new GuardedState(
        () => {
            this.scheduleTask = NULL_OP;

            if( this.Requested.isInside ) {
                // Requested will not be able to leave.
                frameScheduler.cancelScheduledTask(this.task);
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