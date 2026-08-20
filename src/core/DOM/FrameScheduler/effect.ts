import { frameScheduler } from "./FrameScheduler";

export function effect(callback: () => void): () => void {

    return () => {
        if( ! frameScheduler.isTaskScheduled(callback) )
            frameScheduler.scheduleTask(callback);
    }
}