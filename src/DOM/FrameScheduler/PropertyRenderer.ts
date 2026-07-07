import { PropertiesProvider } from "MWL@2026:Reactive/Properties/createProperties";
import TaskList from "./TaskList";
import { PropertiesCallback } from "MWL@2026:Reactive/Properties/watchProperties";
import deferredCallback from "./deferredCallback";
import { watchProperties } from "MWL@2026:Reactive/Properties/watchProperties";
import { observe } from "MWL@2026:Reactive/Observers/observe";

export function renderProperties<T extends Record<string, any>>(
                        properties: PropertiesProvider<T>,
                        taskList  : TaskList,
                        callback: PropertiesCallback<T>
                    ) {    
    observe(properties, deferredCallback(taskList, callback));
}

export function renderProperty<T extends Record<string, any>>(
                        properties: PropertiesProvider<T>,
                        keys: readonly Extract<keyof NoInfer<T>, string>[]
                            | Extract<keyof NoInfer<T>, string>,
                        taskList  : TaskList,
                        callback: PropertiesCallback<T>
                    ) {

    if( ! Array.isArray(keys) )
        keys = [keys] as readonly Extract<keyof T, string>[];
    
    watchProperties(properties, keys, deferredCallback(taskList, callback));
}

export default class PropertyRenderer<T extends Record<string, any>> {

    readonly properties: PropertiesProvider<T>;
    readonly taskList  : TaskList;

    constructor(
                    properties: PropertiesProvider<T>,
                    taskList  : TaskList
                ) {

        this.properties = properties;
        this.taskList   = taskList;
    }

    bind(
            keys: readonly Extract<keyof T, string>[]
                | Extract<keyof T, string>,
            callback: PropertiesCallback<T>
        ) {
        renderProperty(this.properties, keys, this.taskList, callback);
    }
}