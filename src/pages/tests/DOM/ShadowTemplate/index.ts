import ShadowTemplate from "@/DOM/ShadowTemplate";

const target = document.querySelector<HTMLElement>("div")!;

const template = new ShadowTemplate({
    content: "ok",
    style  : ":host { background-color: blue }"
});

template.createShadowRoot(target);