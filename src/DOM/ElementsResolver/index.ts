import { Cstr, isClass } from "@/types";
import { Elements, ExtractionTarget } from "./core/types";
import getElements from "./getElements";
import resolveElements, { Resolver, Resolvers } from "./resolveElements";
import classResolver from "./resolvers/classResolver";
import instanceResolver from "./resolvers/instanceResolver";

type Descriptors<E extends Elements> = {
    [K in keyof E]: Resolver<E[K]>|Cstr<E[K]>|E[K]
}

export default class ElementsResolver<E extends Elements> {

    private readonly resolvers: Resolvers<E>;

    constructor(descriptors: Descriptors<E>) {

        this.resolvers = {} as Resolvers<E>;
        for(const name in descriptors) {

            let descriptor = descriptors[name];

            if( isClass(descriptor) )
                // @ts-ignore
                descriptor = classResolver(descriptor);
            else if( typeof descriptor !== "function" )
                // @ts-ignore
                descriptor = instanceResolver(descriptor);

            // @ts-ignore
            this.resolvers[name] = descriptor;
        }
    }

    resolve(target: ExtractionTarget) {
        const elems = getElements(target);

        return resolveElements(elems, this.resolvers);
    }
}

export function resolve<E extends Elements>(
                        target: ExtractionTarget,
                        descriptors: Descriptors<E>
                    ) {
    const resolver = new ElementsResolver(descriptors);
    return resolver.resolve(target);
}