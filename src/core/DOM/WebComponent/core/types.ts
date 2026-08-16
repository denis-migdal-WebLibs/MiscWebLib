import { Elements } from "MWL@2026/core/DOM/ElementsResolver";

export type Root = HTMLElement|ShadowRoot;

export type ViewCtx<E extends Elements = Elements> = {
    target  : HTMLElement,
    root    : Root,
    elements: E
};

export type ViewCallback<
                    Ctx    extends ViewCtx,
                    Args   extends unknown[],
                    Return
    > = (this: void, ctx: Ctx, ...args: Args) => Return;