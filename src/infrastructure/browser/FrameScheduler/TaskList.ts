import {Task} from "./Task";
import { CallbackList } from "MWL@2026/modules/Callbacks";

//TODO: move to types ?
type Public<T> = { [K in keyof T]: T[K]; };

export class TaskList implements Public<Task> {

    private readonly globalTask: Task;
    private readonly executionHook = new CallbackList();

    constructor() {
        this.globalTask = new Task( () => this.executionHook.trigger() );
    }
    schedule  (): void { this.globalTask.schedule  (); }
    cancel    (): void { this.globalTask.cancel    (); }
    suspend   (): void { this.globalTask.suspend   (); }
    resume    (): void { this.globalTask.resume    (); }
    executeNow(): void { this.globalTask.executeNow(); }

    add   (task: () => void) { this.executionHook.add   (task) }
    remove(task: () => void) { this.executionHook.remove(task) }
}