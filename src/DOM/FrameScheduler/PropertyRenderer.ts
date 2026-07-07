import { PropertiesProvider } from "MWL@2026:Reactive/Properties/createProperties";
import TaskList from "./TaskList";
import { PropertiesCallback } from "MWL@2026:Reactive/Properties/watchProperties";
import deferredCallback from "./deferredCallback";
import { watchProperties } from "MWL@2026:Reactive/Properties/watchProperties";

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

        if( ! Array.isArray(keys) )
            keys = [keys] as readonly Extract<keyof T, string>[];
        
        watchProperties(this.properties, keys, deferredCallback(this.taskList, callback));
    }
}