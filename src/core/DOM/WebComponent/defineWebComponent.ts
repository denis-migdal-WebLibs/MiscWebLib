import { NULL_OBJ } from "MWL@2026:core/types";
import { MAIN_EVENT } from "MWL@2026:core/Reactive/CallbackRegistry";

import { Elements } from "../ElementsResolver/core/types";
import createViewFactory, { ViewFactoryArgs } from "./createViewFactory";
import { asControllerFactory, ControllerProvider } from "./core/controller";
import { getMember, MemberType } from "./core/memberResolver";

export default function defineWebComponent<
                        E         extends Elements    = {},
                        CTRLER    extends object|void = void,
                        RetAPI    extends object|void = void,
                        API       extends object|void = RetAPI extends void ? CTRLER : RetAPI,
                        D         extends Record<string, any> = {},
                >(
                    args: {
                            name: Lowercase<`${string}-${string}`>,
                            Controller?: ControllerProvider<CTRLER, D>
                        }
                        & ViewFactoryArgs<E, RetAPI, [CTRLER]>
                ) {

    const ctrlerFactory = asControllerFactory(args.Controller);
    const createView    = createViewFactory( args );

    class WebComponent extends HTMLElement {

        readonly renderer;

        readonly api: API;
        readonly properties  : MemberType<API, "properties">;
        readonly [MAIN_EVENT]: MemberType<API, typeof MAIN_EVENT>;

        //readonly _id = genId();

        constructor(data: Partial<D> = NULL_OBJ) {
            super();

            const controller = ctrlerFactory.call(this, data);

            const view    = createView(this, controller);
            this.renderer = view.renderer;

            if( view.api !== undefined)
                // @ts-ignore
                this.api = view.api;
            else
                // @ts-ignore
                this.api = controller;

            this.properties  = getMember(this.api, "properties");
            this[MAIN_EVENT] = getMember(this.api, MAIN_EVENT);
        }

        // currently the most efficient way to proceed.
        // IntersectionObserver has a frame of latency...
        connectedCallback   () { this.renderer.resume(); }
        disconnectedCallback() { this.renderer.suspend(); }
    }

    customElements.define(args.name, WebComponent);

    return WebComponent;
}