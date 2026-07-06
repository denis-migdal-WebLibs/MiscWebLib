import { NULL_OP } from "MWL@2026:types";
import { createResolver, Elements, ElementsDescriptors } from "../ElementsResolver";
import TaskList from "../FrameScheduler/TaskList";
import ShadowTemplate, { ShadowTemplateArgs } from "../ShadowTemplate"
import { ViewCtx } from "./core/types";

type Ctx<E extends Elements> = ViewCtx<E> & {renderer: TaskList};

type InitializeCallback<
                        E    extends Elements,
                        API  extends object|void,
                        ARGS extends any[],
                > = (this: Ctx<NoInfer<E>>, ...args: ARGS) => API;

export type ViewFactoryArgs<
                        E    extends Elements,
                        API  extends object|void,
                        ARGS extends any[],
                > = ShadowTemplateArgs
                    & {
                        elements  ?: ElementsDescriptors<E>,
                        initialize?: InitializeCallback<NoInfer<E>, API, ARGS>
                    }

// Only handle the WebComponent "insides".
// Controller construction and data extraction is not its responsibility.
// Sometimes, Controller needs to be its own parameter, cf:
// - https://github.com/microsoft/TypeScript/issues/63378
// - https://github.com/microsoft/TypeScript/issues/63377
export default function createViewFactory<
                        E    extends Elements,
                        API  extends object|void = void,
                        ARGS extends any[]       = [],
                >(
                    args : ViewFactoryArgs<E, API, ARGS>
                ) {

    const template         = new ShadowTemplate(args);
    const elementsResolver = createResolver(args.elements);

    const initialize = args.initialize ?? NULL_OP as () => API;

    return (
            target : HTMLElement,
            ...args: ARGS
        ) => {

        const root     = template.createShadowRoot(target);
        const elements = elementsResolver(root);
        const renderer = new TaskList();

        const ctx = { target, root, elements, renderer };

        return {
            renderer,
            api: initialize.apply(ctx, args)
        }
    }
}