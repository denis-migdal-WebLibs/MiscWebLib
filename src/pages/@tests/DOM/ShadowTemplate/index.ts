import {ShadowTemplate} from "MWL@2026/modules/@platform/DOM";

const target = document.querySelector<HTMLElement>("div")!;

const template = new ShadowTemplate({
    content: "ok",
    style  : ":host { background-color: blue }"
});

template.createShadowRoot(target);