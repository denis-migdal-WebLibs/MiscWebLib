import defineWebComponent from "MWL@2026:DOM/WebComponent/defineWebComponent";

const Klass = defineWebComponent(
    class X {
        constructor(_data: {foo?: string}) {

        }
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


const elem = new Klass({foo:"34"});
document.body.append( elem );