import { MAIN_EVENT } from "MWL@2026/core/Reactive/Observers/MAIN_EVENT";
import { FCT_ID, NULL_OBJ } from "MWL@2026/exports/types";

export type CoordinatorClass<
                            Config extends Record<string, any>,
                            WidgetAPI,
                            DAPI extends keyof WidgetAPI,
                            ViewCtx
                        >
                    = {
                        new(config?: Partial<Config>): {
                            readonly widgetAPI  : WidgetAPI,
                            readonly viewCtx    : ViewCtx
                        }
                        readonly directAPI  : readonly DAPI[]
                    };

//TODO...
type ModelProvider<Config extends Record<string,any>, T extends object>
                        = (config: Partial<Config>) => T;

export function modelFactory(config: Partial<{foo: 34, faa: "ok"}>): {foo: 34, faa: "ok"} {
    return config as any;
}

export type CreateCoordinatorClassOpts<
                            Config extends Record<string,any>,
                            T extends object,
                            ViewCtx   = T,
                            WidgetAPI = T,
                        > = {
    presentationModel: ModelProvider<Config, T>,
    viewCtx         ?: (presentation: NoInfer<T>) => ViewCtx,
    widgetAPI       ?: (presentation: NoInfer<T>) => WidgetAPI
};

// explicit return type annotation required.
export function createCoordinatorClass<
                        Config extends Record<string, any>,
                        T extends object,
                        ViewCtx   = T,
                        WidgetAPI = T
                    >(
                        opts: CreateCoordinatorClassOpts<Config, T, ViewCtx, WidgetAPI>
                    ): CoordinatorClass<Config, WidgetAPI, Extract<keyof WidgetAPI, "properties"|typeof MAIN_EVENT>, ViewCtx> {

    let viewCtx = opts.viewCtx!;
    if( viewCtx === undefined )
        viewCtx = FCT_ID as any;

    let widgetAPI = opts.widgetAPI!;
    if( widgetAPI === undefined )
        widgetAPI = FCT_ID as any;

    // we need static informations...
    return class CoordinatorClass {

        readonly presentationModel;

        constructor(config: Partial<Config> = NULL_OBJ) {
            this.presentationModel = opts.presentationModel(config);
        }

        get viewCtx  () { return viewCtx  (this.presentationModel) }
        get widgetAPI() { return widgetAPI(this.presentationModel) }

        // always redirect.
        static readonly directAPI = [
            MAIN_EVENT,
            "properties"
        ] as any as readonly never[]; // h4ck
    }
}

// ======================

export type CoordinatorClass2<
                            Config extends Record<string, any>,
                            WidgetAPI,
                            DAPI extends keyof WidgetAPI,
                            ViewModel
                        >
                    = {
                        new(config?: Partial<Config>): {
                            readonly widgetAPI  : WidgetAPI,
                            readonly viewModel  : ViewModel
                        }
                        readonly directAPI  : readonly DAPI[]
                    };

export type CoordinatorOpts<
                            T extends object,
                            ViewModel = T,
                            WidgetAPI = T,
                        > = {
    viewModel       ?: (presentation: NoInfer<T>) => ViewModel,
    widgetAPI       ?: (presentation: NoInfer<T>) => WidgetAPI
};

type CoordinatorDAPI<T> = Extract<keyof T, "properties"|typeof MAIN_EVENT>;

// explicit return type annotation required.
export function Coordinator<
                        Config extends Record<string, any>,
                        T extends object,
                        ViewModel = T,
                        WidgetAPI = T
                >(
                    modelProvider: ModelProvider<Config, T>,
                    opts: CoordinatorOpts<T, ViewModel, WidgetAPI> = NULL_OBJ
                ): CoordinatorClass2<
                                    Config,
                                    WidgetAPI,
                                    CoordinatorDAPI<WidgetAPI>,
                                    ViewModel> {

    let viewModel = opts.viewModel!;
    if( viewModel === undefined )
        viewModel = FCT_ID as any;

    let widgetAPI = opts.widgetAPI!;
    if( widgetAPI === undefined )
        widgetAPI = FCT_ID as any;

    // we need static informations...
    return class CoordinatorClass {

        readonly presentationModel;

        constructor(config: Partial<Config> = NULL_OBJ) {
            this.presentationModel = modelProvider(config);
        }

        get viewModel() { return viewModel(this.presentationModel) }
        get widgetAPI() { return widgetAPI(this.presentationModel) }

        // always redirect.
        static readonly directAPI = [
            MAIN_EVENT,
            "properties"
        ] as any as readonly never[]; // h4ck
    }
}