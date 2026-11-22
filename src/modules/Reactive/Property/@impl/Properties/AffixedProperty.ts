import { addLink, isReactive, ReactiveObject } from "MWL@2026/modules/Reactive/Reaction";
import { AffixedProperty } from "../../@contract/@types/def";
import { PropertyDetails } from "../../@contract";

const AffixedProperty: PropertyDetails["AffixedProperty"]
    = class <T extends object> extends    ReactiveObject
                implements AffixedProperty<T>
            {

        readonly isResolved = true;

        protected readonly value;
        constructor(value: T) {
            super();
            this.value = value;

            if( isReactive(value) )
                addLink(value, this);
        }

        get() { return this.value; }

    }

export {AffixedProperty};