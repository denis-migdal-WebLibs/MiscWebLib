import {
        ShadowTemplate, ShadowTemplateArgs,
        createResolver, Elements, ElementsDescriptors
    } from "MWL@2026/exports/DOM";
import {TaskList} from "MWL@2026/exports/browser/scheduler";
import { NULL_OP } from "MWL@2026/core/types";

export type ViewFactory<ViewCtx> = (
                                        target  : HTMLElement,
                                        renderer: TaskList,
                                        ctx     : ViewCtx
                                    ) => void;

type SetupCallback<
            ViewModel,
            E extends Elements,
        > = (
                this: {
                    elements: E,
                    target  : HTMLElement,
                    root    : ShadowRoot,
                    renderer: TaskList
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