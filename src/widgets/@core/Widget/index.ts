import { NULL_OBJ } from "MWL@2026/@exports/types";
import { ViewFactory } from "./View";
import { CoordinatorClass, NullCoordinator } from "./Coordinator";

import { extractConfig } from "./extractConfig";
import { TaskList } from "MWL@2026/@exports/browser/scheduler";

export type Widget<Subject> = HTMLElement & { readonly subject : Subject };
export type WidgetName = Lowercase<`${string}-${string}`>;

// Sometimes, Coordinator needs to be its own parameter, cf:
// - https://github.com/microsoft/TypeScript/issues/63378
// - https://github.com/microsoft/TypeScript/issues/63377
export function defineWidget<   
        Config extends Record<string, any>,
        Subject,
        ViewModel
    >(
        ...args: [
            name            : WidgetName,
            coordinatorClass: CoordinatorClass<Config, Subject, ViewModel>,
            viewFactory     : ViewFactory<NoInfer<ViewModel>>,
        ]|[
            name            : WidgetName,
            viewFactory     : ViewFactory<NoInfer<ViewModel>>,
        ]
    ): {readonly name: string, new(cfg?: Partial<Config>): Widget<Subject>} {

    const name: WidgetName = args[0];
    
    const coordinatorClass = ( args.length >= 3 ? args[1]
                                                : NullCoordinator
                        ) as CoordinatorClass<Config, Subject, ViewModel>;

    const viewFactory = args[args.length-1] as ViewFactory<ViewModel>;

    class Widget extends HTMLElement {

        static override readonly name = getClassName(name);

        readonly subject;
        readonly renderer = new TaskList();

        constructor(config: Partial<Config> = NULL_OBJ) {
            super();

            config = extractConfig(this, config);

            const coordinator = new coordinatorClass(config);
            viewFactory(this, this.renderer, coordinator.viewModel);

            // must be fetched AFTER view initialization.
            this.subject = coordinator.subjectModel;
        }

        // currently the most efficient way to proceed.
        // IntersectionObserver has a frame of latency...
        connectedCallback   () { this.renderer.resume(); }
        disconnectedCallback() { this.renderer.suspend(); }
    }

    customElements.define(name, Widget);

    return Widget;
}

function getClassName(name: string) {
    return name.replace(/(?:^|-)([a-z])/g, (_, char) => char.toUpperCase()) + "Widget";
}