import { ReactiveObject } from "MWL@2026/modules/Reactive/Reaction";
import { ImmutableProperty } from "../../@contract/@types/def";
import { PropertyDetails } from "../../@contract";

const ImmutableProperty: PropertyDetails["ImmutableProperty"]
    = class <T> extends    ReactiveObject
                implements ImmutableProperty<T>
            {

        //readonly valueProvider: ValueProvider<T> = this;
        readonly isResolved = true;

        protected readonly value;
        constructor(value: T) {
            super();
            this.value = value;
        }

        get() { return this.value; }

    }

export {ImmutableProperty};