import GuardedState from "./GuardedState";
import { CallbackList } from "MWL@2026/modules/Callbacks";

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

    private readonly executionHook = new CallbackList();

    private readonly core  = new FrameSchedulerCore( () => {
        this.executionHook.trigger();
        this.executionHook.clear();
    });

    isTaskScheduled( task: FrameTask ) {
        return this.executionHook.has(task);
    }

    scheduleTask( task: FrameTask ) {
        this.executionHook.add(task);
        this.core.schedule();
    }

    cancelScheduledTask(task: FrameTask) {
        this.executionHook.remove(task);
    }
}

export const frameScheduler = new FrameScheduler();