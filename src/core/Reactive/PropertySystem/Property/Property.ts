import { PropertyController, RWPropertyController } from "./PropertyController";
import { PropertyValue } from "./PropertyValue";
import { ReactiveObject } from "../ReactiveObject/ReactiveObject";
import { triggerReactiveObject } from "../ReactiveObject/ReactiveScheduler";
import { addDependencyLink } from "./sync/links";

export class Property<T> extends ReactiveObject {

    readonly controller!: PropertyController<T>;
    value              !: PropertyValue<T>;

    constructor(controller: PropertyController<T>) {
        super();

        if( controller === null)
            return;

        this._setController(controller);
    }

    // internal, used to complete Property
    _setController(controller: PropertyController<T>) {

        // @ts-expect-error
        this.controller = controller;
        this.value      = controller;

        if( "dependencies" in controller) {

            for(let i = 0; i < controller.dependencies.length; ++i)
                addDependencyLink(controller.dependencies[i], this);
        }   
    }

    set(value: T) {

        __ASSERT__( ! this.isRO, "This property is RO only");

        const controller = this.controller as RWPropertyController<T>;
        this.value = controller;

        if( ! controller.isChange(value) ) // currently it works.
            return;
        
        controller.set(value);
        triggerReactiveObject(this);
    }

    get() {
        return this.value.get();
    }

    get isRO() {
        // do NOT use readonly property (for IncompleteProperty).
        // "set" in null => error.
        return ! ("set" in this.controller);
    }
}

export function createIncompleteProperty<T>() {
    return new Property<T>(null as any);
}

export function completeProperty<T>(
                                    property: Property<T>,
                                    controller: PropertyController<T>
                                ) {
    property._setController(controller);
    return property;
}