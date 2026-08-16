import { NULL_OBJ } from "MWL@2026/core/types";
import { WCID_DATANAME } from "../../ElementsResolver/getElements";

export const WC_ATTRNAME   = "config";
export function extractData<D extends Record<string,any>>(
                                                target: HTMLElement,
                                                override: Partial<D>
                                            ) {

    if( override !== NULL_OBJ )
        return override;

    let props: Partial<D> = {};

    const attrValue = target.dataset[WC_ATTRNAME];
    if( attrValue !== undefined)
        props = JSON.parse( attrValue );

    for( const name in target.dataset ) {

        if( name === WC_ATTRNAME || name === WCID_DATANAME) continue;

        // @ts-expect-error
        props[name] = target.dataset[name]!;
    }

    return props;
}