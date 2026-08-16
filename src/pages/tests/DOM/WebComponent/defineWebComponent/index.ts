import {defineWebComponent} from "MWL@2026/core/DOM/WebComponent/defineWebComponent";

class Controller {
    readonly i: number;
    constructor(args: {i?: number} = {}) {
        this.i = args.i ?? 2;
    }
    foo() {}
}

const Klass = defineWebComponent(
    {
        name        : "my-webcomp",
        Controller,
        //argsResolver: (i: number) => [new X(i)] as const, // first form...
        content : "<div data-wcid='ok'>ok</div>",
        style   : ":host { display: block; background-color: blue }",
        elements: {
            ok: HTMLDivElement
        },
        initialize(ctrler) {
            console.warn("init", this);

            return ctrler;
        }
    });

const elem = new Klass();
document.body.append( elem );

elem.api;

{
    const Klass = defineWebComponent(
    {
        name        : "my-webcomp1",
        Controller(args: any) { return new Controller(args) },
        content : "<div data-wcid='ok'>ok</div>",
        style   : ":host { display: block; background-color: blue }",
        elements: {
            ok: HTMLDivElement
        },
        initialize(ctrler) {
            console.warn("init", this);

            return ctrler;
        }
    });

    const elem = new Klass();
    elem.api;
}
{
    console.warn("start");

    const Klass = defineWebComponent(
    {
        name        : "my-webcomp2",
        //argsResolver: (i: number) => [new X(i)] as const, // first form...
        content : "<div data-wcid='ok'>ok</div>",
        style   : ":host { display: block; background-color: blue }",
        elements: {
            ok: HTMLDivElement
        },
        initialize(ctrler) {
            console.warn("init", this);

            return ctrler;
        }
    });

    const elem = new Klass();
    elem.api; // should be never...
}