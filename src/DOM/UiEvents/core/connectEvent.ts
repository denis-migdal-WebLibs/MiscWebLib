import RichEvent from "./RichEvent";

export default function connectEvent<NAME extends string>(
                                        target    : EventTarget,
                                        ev        : RichEvent<NAME, any>,
                                        controller: {[K in NAME]: () => void}
                                    ) {
    ev.attach(target, () => controller[ev.name]() );
}

export function connectEvents<NAME extends string>(
                                    target    : EventTarget,
                                    evs       : readonly RichEvent<NAME, any>[],
                                    controller: {[K in NAME]: () => void}
                                ) {

    for(let i = 0; i < evs.length; ++i)
        connectEvent(target, evs[i], controller);
}