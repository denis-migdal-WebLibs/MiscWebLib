import createViewFactory from "MWL@2026:DOM/WebComponent/createViewFactory";

class X {
    foo() {}
}

const factory = createViewFactory( (_a: number) => new X(),
    {
        content : "<div data-wcid='ok'>ok</div>",
        style   : ":host{ background-color: blue }",
        elements: {
            ok: HTMLDivElement
        },
        initialize: (ctx, ctrler, renderer) => {
            console.warn("init", ctx, ctrler, renderer);
        }
    });

const target = document.querySelector("div")!;

const obj = factory(target, 34);

obj.ctx.elements;

console.warn(obj);