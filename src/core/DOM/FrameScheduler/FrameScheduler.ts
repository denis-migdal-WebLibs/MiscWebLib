import {CallbackRegistry} from "MWL@2026/core/Reactive/CallbackRegistry";
import GuardedState from "MWL@2026/core/GuardedState";

type FrameTask = () => void;

class FrameSchedulerCore {

    private readonly callback: FrameTask;
    constructor(callback: FrameTask) {
        this.callback = callback;
    }

    schedule() {
        this.Scheduled.enter();
    }

    // avoid recrating it at upon each enter.
    private readonly rAF_callback = () => this.Scheduled.leave();

    private readonly Scheduled = new GuardedState(
        () => requestAnimationFrame( this.rAF_callback ),
        () => this.callback(),
    )
}

export class FrameScheduler {

    private readonly tasks = new CallbackRegistry( this, true );

    private readonly core  = new FrameSchedulerCore( () => {
        this.tasks.trigger();
    });

    scheduleTask( task: FrameTask ) {
        this.tasks.add(task);
        this.core.schedule();
    }

    cancelScheduledTask(task: FrameTask) {
        this.tasks.remove(task);
    }
}

export const frameScheduler = new FrameScheduler();