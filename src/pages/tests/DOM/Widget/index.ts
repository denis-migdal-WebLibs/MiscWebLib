import {defineWidget, defineWidget2, defineWidget3} from "MWL@2026:core/DOM/Widget";
import { Coordinator, createCoordinatorClass, modelFactory } from "MWL@2026:core/DOM/Widget/Coordinator";
import { createPassiveViewFactory, View } from "MWL@2026:core/DOM/Widget/View";


type Expand<T> = T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;
    
function expose<K extends string|symbol>() {
    return <T extends Record<K, any>>(target: T): Expand<Pick<T, K>> => {
        return target as any;
    }
}

{
    const Klass = defineWidget3(
            "my-webcomp3",
            Coordinator(modelFactory, {
                viewModel: expose<"foo">(),
                widgetAPI: expose<"faa">(),
            }),
            View({
                content  : "<div data-wcid='ok'>ok</div>",
                style    : ":host { display: block; background-color: blue }",
                elements : {
                    ok: HTMLDivElement
                },
                setup(model) {
                    console.warn(this, model);
                },
            }));

    const elem = new Klass();
    document.body.append( elem );

    console.warn( elem.api );
    console.warn( elem );
}
{
    const Klass = defineWidget({
        name            : "my-webcomp",
        coordinatorClass: createCoordinatorClass({
            presentationModel: modelFactory, // could also be class.
                viewCtx      : (p) => p as {}
        }),
        viewFactory     : createPassiveViewFactory({
            content : "<div data-wcid='ok'>ok</div>",
            style   : ":host { display: block; background-color: blue }",
            elements: {
                ok: HTMLDivElement
            },
            initialize(ctx) { // on défini un contrat.
                console.warn(this, ctx);
            },
        })
    });

    const elem = new Klass();
    document.body.append( elem );

    console.warn( elem.api );
    console.warn( elem );
}

{
    const Klass = defineWidget2({
        name     : "my-webcomp2",
        presentationModel: modelFactory, // could also be a class.
            // could have helpers
            viewCtx      : (p) => p as Pick<typeof p, "foo">,
            widgetAPI    : (p) => p as Pick<typeof p, "faa">,
        content  : "<div data-wcid='ok'>ok</div>",
        style    : ":host { display: block; background-color: blue }",
        elements : {
            ok: HTMLDivElement
        },
        initialize(ctx) { // on défini un contrat.
            console.warn(this, ctx);
        },
    });

    const elem = new Klass();
    document.body.append( elem );

    console.warn( elem.api );
    console.warn( elem );
}