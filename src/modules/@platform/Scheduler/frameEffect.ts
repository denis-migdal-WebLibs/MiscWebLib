import { frameScheduler } from "./FrameScheduler";

export function frameEffect(callback: () => void): () => void {

    return () => {
        if( ! frameScheduler.isTaskScheduled(callback) )
            frameScheduler.scheduleTask(callback);
    }
}