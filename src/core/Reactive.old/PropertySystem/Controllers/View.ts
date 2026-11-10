import { Cstr, isClass, NO_VALUE } from "MWL@2026/core/types";
import { DerivedPropertyController } from "../Property/PropertyController";
import { Property } from "../Property/Property";
import { getProperty } from "../Properties/PropertiesProvider";
import { Properties } from "../Properties/Properties";

export class ViewController<T, U> implements DerivedPropertyController<T> {

    protected readonly transform: (value: U) => T;

    readonly dependencies: [Property<U>];
    protected cache: T = NO_VALUE;

    constructor(
                    source   : Property<U>,
                    transform: (value: U) => T
                ) {

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
}

type ViewConverter<T, U> = {convert(value: U): T};
//(target: U, prevVal: T|typeof NO_VALUE) => T;

export function View<K extends string, T, U>(
            target   : K,
            converter: Cstr<ViewConverter<T, U>>|((value: U) => T)
        ) {

    return function (this: Readonly<Record<K, U>>) {

        const source = getProperty(this as Properties<Record<K, U>>,
                                    target);

        let transform: (value: U) => T = converter as any;
        if( isClass(converter) ) {
            const instance = new converter();
            transform = (o) => instance.convert(o);
        }

        return new ViewController( source, transform )
    };
}