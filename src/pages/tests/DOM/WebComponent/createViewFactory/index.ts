import createViewFactory from "@/DOM/WebComponent/createViewFactory";

class X {
    foo() {}
}

const factory = createViewFactory( (_target, _a: number) => new X(),
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