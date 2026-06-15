import { Elements, ExtractionTarget } from "./core/types";

const WCID_ATTRNAME = "data-wcid";
const WCID_SELECTOR = `[${WCID_ATTRNAME}]`;

export default function getElements(target: ExtractionTarget) {

    const results = {} as Elements;

    const elements = target.querySelectorAll<HTMLElement>(WCID_SELECTOR);

    for(let i = 0; i < elements.length; ++i) {
        const name = elements[i].getAttribute(WCID_ATTRNAME)!;
        results[name] = elements[i];
    }

    return results;
}