import { NO_VALUE } from "MWL@2026/@exports/types";
import { Property, ValueProvider } from "../contract";
import { ReactiveObject } from "../../Scheduler";

export class ViewProperty<T, U> extends ReactiveObject {

    protected readonly transform: (value: U) => T;

    readonly dependencies: [Property<U>];
    protected cache: T = NO_VALUE;

    constructor(
                    source   : Property<U>,
                    transform: (value: U) => T
                ) {

        super( () => this.onPropagate() )

        this.dependencies = [source];
        this.transform = transform;
    }

    clearValue(): void {
        this.cache = NO_VALUE;
    }

    get() {

        if( this.cache !== NO_VALUE )
            return this.cache;

        return this.cache = this.transform(this.dependencies[0].get());
    }

    readonly valueProvider: ValueProvider<T> = this;

    onPropagate() {
        this.cache = NO_VALUE;
    }
}