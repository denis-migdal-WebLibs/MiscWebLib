import StateGuard from "@/StateGuard";
import scheduler from "./FrameScheduler";

function taskScheduler(callback: () => void) {

    const task = () => scheduleGuard.leave();

    const scheduleGuard = new StateGuard(
        () => scheduler.scheduleTask( task ),
        callback,
    )

    return () => scheduleGuard.enter();
}

export default class Task {

    private readonly callback   : () => void;

    private readonly executionGuard = new StateGuard(
        taskScheduler( () => this.executionGuard.leave() ),
        () => this.callback() // due to initialization issues.
    )

    constructor(callback: () => void) {
        this.callback = callback;
    }

    schedule() {
        this.executionGuard.enter();
    }

    cancel() {
        this.executionGuard.cancel();
    }

    executeNow() {
        this.executionGuard.leave(); // force early.
    }
}