import {createViewFactory} from "MWL@2026/core/DOM/WebComponent/createViewFactory";

class X {
    foo() {}
}

const factory = createViewFactory({
        content : "<div data-wcid='ok'>ok</div>",
        style   : ":host{ background-color: blue }",
        elements: {
            ok: HTMLDivElement
        },
        initialize(ctrler: X) {
            console.warn("init", this, ctrler);
        }
    });

const target = document.querySelector("div")!;

const obj = factory(target, new X() );

console.warn(obj);