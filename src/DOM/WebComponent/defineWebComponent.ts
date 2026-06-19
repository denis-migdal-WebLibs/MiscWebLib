import { Cstr, FCT_NULL, isClass, NULL_OBJ } from "@/types";
import { Elements } from "../ElementsResolver/core/types";
import createViewFactory, { ViewFactoryArgs } from "./createViewFactory";
import { WCID_DATANAME } from "../ElementsResolver/getElements";

export const WC_ATTRNAME   = "config";
function extractData<D extends Record<string,any>>(
                                                target: HTMLElement,
                                                override: Partial<D>
                                            ) {

    if( override !== NULL_OBJ )
        return override;

    let props: Partial<D> = {};

    const attrValue = target.dataset[WC_ATTRNAME];
    if( attrValue !== undefined)
        props = JSON.parse( attrValue );

    for( const name in target.dataset ) {

        if( name === WC_ATTRNAME || name === WCID_DATANAME) continue;

        // @ts-ignore
        props[name] = target.dataset[name]!;
    }

    return props;
}

type GetProperties<C extends object|null>
    = C extends null ? null
                     : C extends {readonly properties: any}
                        ? C["properties"]
                        : null;

function getProperties<C extends object|null>(c: C): GetProperties<C> {
    if( c === null || ! ("properties" in c) )
        return null as any;

    return c.properties as any;
}

type ControllerCstr<C extends object|null,
                    D extends Record<string, any>
                > = C extends null ? null : Cstr<Exclude<C,null>, [Partial<D>]>;

function toFactory<C extends object,
                    D extends Record<string, any>
                >(Klass: ControllerCstr<C, D>) {

    return function(this: HTMLElement, data: Partial<D> = NULL_OBJ): C {
        data = extractData(this, data);
        return new Klass(data) as C;
    }
}

type ControllerFactory<
                    C extends object|null,
                    D extends Record<string, any>
                > = (this: HTMLElement, data: Partial<D>) => C;

export default function defineWebComponent<
                        C extends object|null         = null,
                        E extends Elements            = {},
                        D extends Record<string, any> = {}
                >(
                    Controller:
                          ControllerFactory<C,D>
                        | ControllerCstr   <C,D>,
                    args      : ViewFactoryArgs<NoInfer<C>, E>
                              & {name: Lowercase<`${string}-${string}`>}
                ) {

    let factory: ControllerFactory<C,D>;

    if( Controller === null )
        factory = FCT_NULL as any as ControllerFactory<C,D>;
    else if( isClass( Controller) )
        factory = toFactory(Controller) as ControllerFactory<C,D>;
    else
        factory = Controller;

    const createView = createViewFactory( factory, args );

    class WebComponent extends HTMLElement {

        readonly view;
        readonly controller: C;

        readonly properties: GetProperties<C>;

        //readonly _id = genId();

        constructor(data: Partial<D> = NULL_OBJ) {
            super();

            this.view       = createView(this, data);
            this.controller = this.view.controller;
            this.properties = getProperties(this.controller);
        }

        // currently the most efficient way to proceed.
        // IntersectionObserver has a frame of latency...
        connectedCallback   () { this.view.renderer.resume(); }
        disconnectedCallback() { this.view.renderer.suspend(); }

        forceUiRefresh  () { return this.view.renderer.executeNow(); }
        requestUiRefresh() { return this.view.renderer.schedule(); }
    }

    customElements.define(args.name, WebComponent);

    return WebComponent;
}