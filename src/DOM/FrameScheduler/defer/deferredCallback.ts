import TaskList from "../TaskList";

export function deferredCallback(taskList: TaskList, callback: () => void) {

    // avoid inserting/removing tasks...
    let scheduled = false;

    taskList.add( () => { if(scheduled ) callback(); });

    return () => {
        scheduled = true;
        taskList.schedule();
    }
}