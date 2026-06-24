import { Elements } from "MWL@2026:DOM/ElementsResolver";
import { ExtractionTarget } from "MWL@2026:DOM/ElementsResolver/core/types";

export type Root = ExtractionTarget;

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