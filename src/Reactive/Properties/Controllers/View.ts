import { NO_VALUE, NULL_OP } from "MWL@2026:types";
import { PropertyController } from "../Property";
import { getStamp } from "../PropertiesRenderer";

type ViewAdapter<T, U> = (target: U, prevVal: T|typeof NO_VALUE) => T;

class ViewInstance<K extends string, T, U>
                                                implements PropertyController<T>{

    protected ctx  : Readonly<Record<K,U>>;
    protected key  : K;

    protected calc : ViewAdapter<T, U>;
    protected cache: T|typeof NO_VALUE = NO_VALUE;
    protected cacheStamp: any = NO_VALUE;

    constructor(
                    ctx   : Readonly<Record<K,U>>,
                    target: K,
                    calc  : ViewAdapter<T, U>
                ) {
        // TODO: transfert...
        this.ctx  = ctx;
        this.calc = calc;
        this.key  = target;
    }

    get() {

        const stamp = getStamp(this.ctx, this.key);

        if( this.cache === NO_VALUE || this.cacheStamp !== stamp)
            this.cache = this.calc(this.ctx[this.key], this.cache);

        this.cacheStamp = stamp;
        return this.cache;
    }

    get stamp() {
        return getStamp(this.ctx, this.key);
    }

    set() { return false; }

    readonly markStale = NULL_OP;
}

export default function View<K extends string, T, U>(
            target: K,
            calc  : ViewAdapter<T, U>
        ) {

    return (ctx: Readonly<Record<K, U>>) => {
        return new ViewInstance( ctx, target, calc )
    };
}