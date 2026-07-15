import { Cstr, NO_VALUE, NULL_OP } from "MWL@2026:types";
import { PropertyController } from "../Property";
import { getStamp } from "../PropertiesRenderer";

type ViewConverter<T, U> = {convert(value: U): T};
//(target: U, prevVal: T|typeof NO_VALUE) => T;

class ViewInstance<K extends string, T, U>
                                                implements PropertyController<T>{

    protected ctx  : Readonly<Record<K,U>>;
    protected key  : K;

    protected converter : ViewConverter<T, U>;
    protected cache     : T|typeof NO_VALUE = NO_VALUE;
    protected cacheStamp: any = NO_VALUE;

    constructor(
                    ctx      : Readonly<Record<K,U>>,
                    target   : K,
                    Converter: Cstr<ViewConverter<T, U>>
                ) {
        this.ctx       = ctx;
        this.key       = target;
        this.converter = new Converter();
    }

    get() {

        const stamp = getStamp(this.ctx, this.key);

        if( this.cache === NO_VALUE || this.cacheStamp !== stamp)
            this.cache = this.converter.convert(this.ctx[this.key]);

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
            Adapter  : Cstr<ViewConverter<T, U>>
        ) {

    return (ctx: Readonly<Record<K, U>>) => {
        return new ViewInstance( ctx, target, Adapter )
    };
}