import { observe } from "MWL@2026:Reactive/Observers/observe";
import TaskList from "../TaskList";
import { Observable } from "MWL@2026:Reactive/Observers/EventSource";
import { Event } from "MWL@2026:Reactive/Event";
import { deferredCallback } from "./deferredCallback";

//TODO: could add ARGS...
export function deferredObserve<
                        T    extends object|null,
                    >(
                        target  : Observable<Event<T, []>>,
                        taskList: TaskList,
                        callback: () => void,
                    ) {

    observe(target, deferredCallback(taskList, callback));
}