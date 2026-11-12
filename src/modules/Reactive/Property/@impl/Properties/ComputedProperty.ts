import { addLink, ReactiveObject } from "MWL@2026/modules/Reactive/Reaction";
import { NO_VALUE } from "MWL@2026/modules/@types";

import { PropertyDetails } from "../../@contract";
import { ComputedProperty } from "../../@contract/@types/def";

// We decouple sources and compute to avoid a second generic parameter.
const ComputedProperty: PropertyDetails["ComputedProperty"]
    = class <T>  extends ReactiveObject
                               implements ComputedProperty<T> {

    protected cache: T = NO_VALUE;
    protected readonly compute: () => T;

    constructor(
                    dependencies: readonly ReactiveObject[],
                    compute: () => T
                ) {
        super();

        this.compute = compute;
        const onChange = () => this.cache = NO_VALUE;

        for(let i = 0; i < dependencies.length; ++i)
            addLink(dependencies[i], this, onChange);
    }

    get() {
        if( this.cache !== NO_VALUE )
            return this.cache;

        return this.cache = this.compute();
    }

    get isResolved() { return this.cache !== NO_VALUE }
}

export {ComputedProperty};