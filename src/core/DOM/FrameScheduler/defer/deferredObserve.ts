import { observe } from "MWL@2026/core/Reactive/Observers/observe";
import {TaskList} from "../TaskList";
import { Observable } from "MWL@2026/core/Reactive/Observers/Observable";
import { deferredCallback } from "./deferredCallback";

//TODO: could add ARGS...
export function deferredObserve<
                        T    extends object|null,
                    >(
                        target  : Observable<T>,
                        taskList: TaskList,
                        callback: () => void,
                    ) {

    observe(target, deferredCallback(taskList, callback));
}