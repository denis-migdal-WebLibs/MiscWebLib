import Task from "./Task";
import CallbackRegistry from "MWL@2026:core/Reactive/CallbackRegistry";

//TODO: move to types ?
type Public<T> = { [K in keyof T]: T[K]; };

export default class TaskList implements Public<Task> {

    private readonly globalTask: Task;
    private readonly tasks = new CallbackRegistry(this);

    constructor() {
        this.globalTask = new Task( () => this.tasks.trigger() );
    }
    schedule  (): void { this.globalTask.schedule(); }
    cancel    (): void { this.globalTask.cancel(); }
    suspend   (): void { this.globalTask.suspend(); }
    resume    (): void { this.globalTask.resume(); }
    executeNow(): void { this.globalTask.executeNow(); }

    add   (task: () => void) { this.tasks.add   (task) }
    remove(task: () => void) { this.tasks.remove(task) }
}