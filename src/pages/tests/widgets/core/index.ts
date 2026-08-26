import {defineWidget, Coordinator, View} from "MWL@2026/exports/Widget";

class Model {
    readonly foo = "ok";
    readonly faa = 42;
}

//TODO: types
type Expand<T> = T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

//TODO: move
function expose<K extends string|symbol>() {
    return <T extends Record<K, any>>(target: T): Expand<Pick<T, K>> => {
        return target as any;
    }
}

{
    const Klass = defineWidget(
            "my-webcomp",
            Coordinator(Model, {
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