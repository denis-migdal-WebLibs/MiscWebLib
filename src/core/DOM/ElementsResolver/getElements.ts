import { Elements, ExtractionTarget } from "./core/types";

export const WCID_DATANAME = "wcid";
const WCID_ATTRNAME = `data-${WCID_DATANAME}`;
const WCID_SELECTOR = `[${WCID_ATTRNAME}]`;

export const WID_ATTRNAME = "w-id";
const WID_SELECTOR = `[${WID_ATTRNAME}]`;

export function getElements(target: ExtractionTarget) {

    const results = {} as Elements;

    // old...
    {
        const elements = target.querySelectorAll<HTMLElement>(WCID_SELECTOR);

        for(let i = 0; i < elements.length; ++i) {
            const name = elements[i].getAttribute(WCID_ATTRNAME)!;
            results[name] = elements[i];
        }
        console.warn("old ID", Object.keys(results));
    }

    const elements = target.querySelectorAll<HTMLElement>(WID_SELECTOR);

    for(let i = 0; i < elements.length; ++i) {
        const name = elements[i].getAttribute(WID_ATTRNAME)!;
        results[name] = elements[i];
    }

    return results;
}