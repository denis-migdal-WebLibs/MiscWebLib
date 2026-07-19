import { Cstr, FCT_FALSE, NO_VALUE } from "MWL@2026:core/types";
import { PropertyController } from "../Property";
import { getProperties } from "../propertiesHelpers";
import PropertyHolder from "../PropertyHolder";
import { CONTROLLERS, Properties } from "../createProperties";

type ViewConverter<T, U> = {convert(value: U): T};
//(target: U, prevVal: T|typeof NO_VALUE) => T;

export class ViewInstance<T, U> implements PropertyController<T> {

    protected readonly converter : ViewConverter<T, U>;

    readonly source: PropertyHolder<U>;
    
    protected cache     : T|typeof NO_VALUE = NO_VALUE;
    protected cacheStamp: any = NO_VALUE;

    constructor(
                    source   : PropertyHolder<U>,
                    Converter: Cstr<ViewConverter<T, U>>
                ) {

        this.source    = source;
        this.converter = new Converter();
    }

    get() {

        const stamp = this.stamp;

        if( this.cache === NO_VALUE || this.cacheStamp !== stamp)
            this.cache = this.converter.convert(this.source.get());

        this.cacheStamp = stamp;
        return this.cache;
    }

    get stamp() {
        return this.source.stamp;
    }

    declare set: typeof FCT_FALSE;
    static {
        this.prototype.set = FCT_FALSE;
    }
}

export default function View<K extends string, T, U>(
            target: K,
            Adapter  : Cstr<ViewConverter<T, U>>
        ) {

    return (ctx: Readonly<Record<K, U>>) => {
        const source = getProperties(ctx as Properties<Record<K, U>>)[CONTROLLERS][target];
        return new ViewInstance( source, Adapter )
    };
}