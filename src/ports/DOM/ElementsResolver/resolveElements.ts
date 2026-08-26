import { Elements } from "./core/types";

// throws if error.
export type Resolver<E extends HTMLElement>  = (element: HTMLElement) => E;
export type Resolvers<E extends Elements> = {
    [K in keyof E]: Resolver<E[K]>
}

export function resolveElements<E extends Elements>(
            elements : Elements,
            resolvers: Resolvers<E>,
        ): E {

    const results = {} as E;

    for(const name in elements) {

        const target  = elements[name];
        const resolver = resolvers[name];

        __ASSERT__(resolver !== undefined, `Unknown element: ${name}`);

        const element = resolver(target)!;

        if( element !== target)
            target.replaceWith(element);

        results[name as keyof E] = element;
    }

    if( __DEBUG__ ) {
        for(let name in resolvers)
            if( ! (name in results) )
                throw new Error(`Element missing: ${name}`);
    }

    return results;
}