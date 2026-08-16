import { NULL_OBJ } from "MWL@2026/core/types";

const CFG_ATTR_NAME = "w:cfg";
const CFG_ATTR_PREFIX = "cfg:";

export function extractConfig<D extends Record<string,any>>(
                                                target: HTMLElement,
                                                override: Partial<D>
                                            ) {

    if( override !== NULL_OBJ )
        return override;

    let props: Partial<D> = {};

    const cfgAttr = target.getAttribute(CFG_ATTR_NAME);
    if( cfgAttr !== null)
        props = JSON.parse( cfgAttr );

    const attrs = [...target.attributes];
    for(let i = 0; i < attrs.length; ++i) {
        if( ! attrs[i].name.startsWith(CFG_ATTR_PREFIX) )
            continue;

        const key = attrs[i].name.slice(CFG_ATTR_PREFIX.length);

        // @ts-expect-error
        props[key] = attrs[i].value;
    }

    return props;
}