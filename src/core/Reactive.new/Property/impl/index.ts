import { NULL_OP } from "MWL@2026/core/types";
import { ReactiveObject, requestReaction } from "../../Scheduler";
import { InferCtrlerValueType, IsCtrlerRO, Property, PropertyController, PropertyLink, RWPropertyController, ValueProvider } from "../contract";

export class PropertyImpl<
                        Ctrler extends PropertyController<any>,
                        T    = InferCtrlerValueType<Ctrler>,
                        IsRO extends boolean = IsCtrlerRO<Ctrler>
                    >
                    extends ReactiveObject<PropertyLink<T>>
                    implements Property<T, IsRO> {

    protected controller   : Ctrler;
    protected valueProvider: ValueProvider<T>;

    readonly isRO: IsRO;
    
    constructor(controller: Ctrler) {

        const isRO = ! ("set" in controller) as IsRO;
        let callback = NULL_OP;
        if( ! isRO )
            callback = () => this.onPropagate();

        super( callback );

        //TODO: dependencies...

        this.isRO = isRO;
        this.valueProvider = this.controller = controller;
    }

    set(value: T) {

        __ASSERT__( ! this.isRO, "This property is RO only");

        const controller = this.controller as RWPropertyController<T>;
        this.valueProvider = controller;

        // opti.
        if( controller.isSameValue(value) )
            return;
        
        controller.set(value);
        requestReaction(this);
    }

    get() {
        return this.valueProvider.get();
    }

    onPropagate() {
        // opti: enable gc to collect old values...
        if( this.controller !== this.valueProvider )
            (this.controller as RWPropertyController<T>).clearValue();
    }
}