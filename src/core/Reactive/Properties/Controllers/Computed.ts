import { NO_VALUE } from "MWL@2026/core/types";
import { PropertyController } from "../Property/PropertyController";

export class ComputedInstance<CTX extends Record<string, any>, T>
                                                extends PropertyController<T>{

    protected readonly ctx : Readonly<CTX>;
    protected readonly calc: (ctx: Readonly<CTX>) => T;
    protected cache: T|typeof NO_VALUE = NO_VALUE;

    constructor(ctx: Readonly<CTX>, calc : (ctx: Readonly<CTX>) => T) {
        super();
        this.ctx  = ctx;
        this.calc = calc;
    }

    get() {
        if( this.cache === NO_VALUE )
            this.cache = this.calc(this.ctx);

        return this.cache;
    }
}

export function Computed<CTX extends Record<string, any>, T>(
            _calc: (ctx: Readonly<CTX>) => T
        ) {

    throw new Error("obsolete use View for now");
    //return (ctx: Readonly<CTX>) => new ComputedInstance( ctx, calc );
}