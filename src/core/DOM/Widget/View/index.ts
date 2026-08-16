import { createResolver, Elements, ElementsDescriptors } from "MWL@2026/core/DOM/ElementsResolver";
import {TaskList} from "MWL@2026/core/DOM/FrameScheduler/TaskList";
import {ShadowTemplate, ShadowTemplateArgs } from "MWL@2026/core/DOM/ShadowTemplate";
import { NULL_OP } from "MWL@2026/core/types";

export type ViewFactory<ViewCtx> = (
                                        target  : HTMLElement,
                                        renderer: TaskList,
                                        ctx     : ViewCtx
                                    ) => void;

type InitializeCallback<
            ViewCtx,
            E extends Elements,
        > = (
                this: {
                    elements: E,
                },
                viewCtx: ViewCtx
            ) => void;

const DEFAULT_INITIALIZE_CALLBACK: InitializeCallback<any, any> = NULL_OP;

export type CreatePassiveViewFactoryOpts<
                        ViewCtx,
                        E    extends Elements,
                    > = ShadowTemplateArgs & {
                            elements  ?: ElementsDescriptors<E>,
                            initialize?: InitializeCallback<
                                                        ViewCtx,
                                                        NoInfer<E>
                                                    >,
                        }

export function createPassiveViewFactory<
                        ViewCtx,
                        E    extends Elements
                    >(opts: CreatePassiveViewFactoryOpts<ViewCtx, E>) {

    const template         = new ShadowTemplate(opts);
    const elementsResolver = createResolver(opts.elements);

    const initialize = opts.initialize ?? DEFAULT_INITIALIZE_CALLBACK;

    return ( target : HTMLElement, renderer: TaskList, ctx: ViewCtx) => {

        const root = template.createShadowRoot(target);
        const elements = elementsResolver(root);

        initialize.call({target, root, elements, renderer}, ctx);
    }
}

type SetupCallback<
            ViewModel,
            E extends Elements,
        > = (
                this: {
                    elements: E,
                },
                viewModel: ViewModel
            ) => void;

const DEFAULT_SETUP_CALLBACK: SetupCallback<any, any> = NULL_OP;

export type ViewOpts<
                    ViewModel,
                    E    extends Elements,
                > = ShadowTemplateArgs & {
                        elements?: ElementsDescriptors<E>,
                        setup   ?: SetupCallback<ViewModel, NoInfer<E>>,
                    }

export function View<
                        ViewModel,
                        E    extends Elements
                    >(opts: ViewOpts<ViewModel, E>) {

    const template         = new ShadowTemplate(opts);
    const elementsResolver = createResolver(opts.elements);

    const setup = opts.setup ?? DEFAULT_SETUP_CALLBACK;

    return ( target : HTMLElement, renderer: TaskList, ctx: ViewModel) => {

        const root = template.createShadowRoot(target);
        const elements = elementsResolver(root);

        setup.call({target, root, elements, renderer}, ctx);
    }
}