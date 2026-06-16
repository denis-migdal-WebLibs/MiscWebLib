import defineWebComponent from "@/DOM/WebComponent/defineWebComponent";

const Klass = defineWebComponent(
    class X {
        foo() {}
    },
    {
        name    : "my-webcomp",
        content : "<div data-wcid='ok'>ok</div>",
        style   : ":host { display: block; background-color: blue }",
        elements: {
            ok: HTMLDivElement
        },
        initialize: (ctx, ctrler, renderer) => {
            console.warn("init", ctx, ctrler, renderer);
        }
    });


const elem = new Klass();
document.body.append( elem );