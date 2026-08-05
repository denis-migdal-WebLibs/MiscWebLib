import { Cstr, NULL_OBJ } from "MWL@2026:exports/types";
import { createPassiveViewFactory, CreatePassiveViewFactoryOpts, ViewFactory } from "./View";
import { CoordinatorClass, CoordinatorClass2, createCoordinatorClass, CreateCoordinatorClassOpts } from "./Coordinator";
import { Elements } from "../ElementsResolver";
import TaskList from "../FrameScheduler/TaskList";
import { extractData } from "../WebComponent/core/extractData";

export type WidgetName = Lowercase<`${string}-${string}`>;

// Sometimes, Coordinator needs to be its own parameter, cf:
// - https://github.com/microsoft/TypeScript/issues/63378
// - https://github.com/microsoft/TypeScript/issues/63377
type DefineWidgetOpts<  
                        Config extends Record<string,any>,
                        WidgetAPI,
                        DAPI extends keyof WidgetAPI,
                        ViewCtx
                    > = {
    name            : WidgetName,
    coordinatorClass: CoordinatorClass<Config, WidgetAPI, DAPI, ViewCtx>,
    viewFactory     : ViewFactory<NoInfer<ViewCtx>>,
}

export function defineWidget2<  
                                Config extends Record<string, any>,
                                PresentationModel extends object,
                                E extends Elements,
                                ViewCtx   = PresentationModel,
                                WidgetAPI = PresentationModel,
        >( opts: {
            name: WidgetName,
        } & CreateCoordinatorClassOpts<Config, PresentationModel, ViewCtx, WidgetAPI>
          & CreatePassiveViewFactoryOpts<NoInfer<ViewCtx>, E>
    ) {

    return defineWidget({
        name: opts.name,
        coordinatorClass: createCoordinatorClass(opts),
        viewFactory     : createPassiveViewFactory(opts),
    });
}

type Expand<T> = T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

type WidgetClass<   
                    Config extends Record<string, any>,
                    WidgetAPI,
                    DAPI extends keyof WidgetAPI,
                > = Cstr<
                        HTMLElement
                        & {
                            readonly api: Expand<WidgetAPI>,
                            readonly renderer: TaskList
                        }
                        & Pick<WidgetAPI, DAPI>,
                        []|[Partial<Config>]
                    >;

export function defineWidget<   
                                Config extends Record<string, any>,
                                WidgetAPI,
                                DAPI extends keyof WidgetAPI,
                                ViewCtx
                            >(
                            opts: DefineWidgetOpts<Config, WidgetAPI, DAPI, ViewCtx>
                        ): WidgetClass<Config, WidgetAPI, DAPI> {

    class Widget extends HTMLElement {

        readonly api;
        readonly renderer = new TaskList();

        constructor(config: Partial<Config> = NULL_OBJ) {
            super();

            //TODO: extractWidgetConfig.
            config = extractData(this, config);

            const coordinator = new opts.coordinatorClass(config);

            opts.viewFactory(this, this.renderer, coordinator.viewCtx);

            // must be fetched AFTER view initialization.
            this.api = coordinator.widgetAPI;
        }

        // currently the most efficient way to proceed.
        // IntersectionObserver has a frame of latency...
        connectedCallback   () { this.renderer.resume(); }
        disconnectedCallback() { this.renderer.suspend(); }
    }

    const DAPI = opts.coordinatorClass.directAPI;

    for(let i = 0; i < DAPI.length; ++i) {
        const key = DAPI[i];

        Object.defineProperty(Widget.prototype, key, {
            get() { return this.api[key]; }
        })
    }

    customElements.define(opts.name, Widget);

    return Widget as any;
}



export function defineWidget3<   
        Config extends Record<string, any>,
        WidgetAPI,
        DAPI extends keyof WidgetAPI,
        ViewModel
    >(
        name            : WidgetName,
        coordinatorClass: CoordinatorClass2<Config, WidgetAPI, DAPI, ViewModel>,
        viewFactory     : ViewFactory<NoInfer<ViewModel>>,
    ): WidgetClass<Config, WidgetAPI, DAPI> {

    class Widget extends HTMLElement {

        readonly api;
        readonly renderer = new TaskList();

        constructor(config: Partial<Config> = NULL_OBJ) {
            super();

            //TODO: extractWidgetConfig.
            config = extractData(this, config);

            const coordinator = new coordinatorClass(config);

            viewFactory(this, this.renderer, coordinator.viewModel);

            // must be fetched AFTER view initialization.
            this.api = coordinator.widgetAPI;
        }

        // currently the most efficient way to proceed.
        // IntersectionObserver has a frame of latency...
        connectedCallback   () { this.renderer.resume(); }
        disconnectedCallback() { this.renderer.suspend(); }
    }

    const DAPI = coordinatorClass.directAPI;

    for(let i = 0; i < DAPI.length; ++i) {
        const key = DAPI[i];

        Object.defineProperty(Widget.prototype, key, {
            get() { return this.api[key]; }
        })
    }

    customElements.define(name, Widget);

    return Widget as any;
}
