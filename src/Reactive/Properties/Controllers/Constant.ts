import { FCT_FALSE, NULL_OP } from "MWL@2026:types";

export default function Constant<T>(value: T) {

    const property = {
        get       : () => value,
        set       : FCT_FALSE,
        markStale : NULL_OP
    };

    return () => property;
}