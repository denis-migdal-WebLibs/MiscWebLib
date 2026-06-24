import { NULL_OP } from "MWL@2026:types";
import { createResolver, Elements, ElementsDescriptors } from "../ElementsResolver";
import TaskList from "../FrameScheduler/TaskList";
import ShadowTemplate, { ShadowTemplateArgs } from "../ShadowTemplate"
import { ViewCallback, ViewCtx } from "./core/types";

//For Hooks
// - use Properties or Events as much as possible.
// - only necessary when needing a response (= requesting for a value).
//  -> event + properties update (?).
// (could be called in Controller constructor):
// 1/ Build context first
// 2/ Build hooks
// 3/ Build Controller, then initialize it.

type InitializeCallback<E extends Elements, C> = ViewCallback<ViewCtx<E>, [
                        controller: C,
                        renderer  : TaskList
                    ], void>;

export type ViewFactoryArgs<
                        C extends object|null,
                        E extends Elements
                > = ShadowTemplateArgs
                    & {
                        elements  ?: ElementsDescriptors<E>,
                        initialize?: NoInfer<InitializeCallback<E, C>>
                    }

// Only handle the WebComponent "inside".
// Controller construction and data extraction is not its responsibility.
// Controller needs to be its own parameter, cf:
// - https://github.com/microsoft/TypeScript/issues/63378
// - https://github.com/microsoft/TypeScript/issues/63377
export default function createViewFactory<
                        C extends object|null = null,
                        E extends Elements    = {},
                        A extends any[]       = []
                >(
                    Controller: (this: HTMLElement, ...args: A) => C,
                    // ViewFactoryControllerProvider<C, D>,
                    args      : ViewFactoryArgs<NoInfer<C>, E>
                ) {

    const template         = new ShadowTemplate(args);
    const elementsResolver = createResolver(args.elements);

    const initialize = args.initialize ?? NULL_OP;

    return (
            target : HTMLElement,
            ...args: A
        ) => {

        const controller = Controller.apply(target, args);

        const root     = template.createShadowRoot(target);
        const elements = elementsResolver(root);
        const ctx = { target, root, elements, };

        const renderer = new TaskList();
        initialize(ctx, controller, renderer);

        return {
            ctx,
            controller,
            renderer,
        } 
    }
}