import StateGuard from "@/StateGuard";

type FrameTask = () => void;

export class FrameScheduler {

    private readonly renderTasks: FrameTask[] = [];

    private readonly AFGuard = new StateGuard(
        () => this.schedule(),
        () => this.execute(),
    )

    scheduleTask( task: FrameTask ) {
        this.renderTasks.push(task);
        this.AFGuard.enter();
    }

    private readonly rAF_callback = () => this.AFGuard.leave();

    // called by AFGuard...
    private schedule() {
        requestAnimationFrame( this.rAF_callback );
    }

    private execute() {
        // renderTasks could be added during execution.
        for(let i = 0; i < this.renderTasks.length; ++i)
            this.renderTasks[i]();

        if( __DEBUG__ ) {
            const set = new Set( this.renderTasks );
            if( set.size !== this.renderTasks.length )
                throw new Error(`Re-entry`);
        }

        this.renderTasks.length = 0;
    }
}

export default new FrameScheduler();