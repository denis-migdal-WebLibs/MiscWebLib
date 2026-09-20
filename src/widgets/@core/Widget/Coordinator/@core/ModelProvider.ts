import { isClass } from "MWL@2026/core/types";

export type ModelProvider<Config extends Record<string,any>, T extends object>
                        = ((config: Partial<Config>) => T)
                        | {new (config: Partial<Config>): T};

export function getModelFactory<
                            Config extends Record<string,any>,
                            T      extends object
                        >(factory: ModelProvider<Config, T>) {
    
    if( ! isClass(factory) )
        return factory;

    return (cfg: Partial<Config>) => new factory(cfg);
}