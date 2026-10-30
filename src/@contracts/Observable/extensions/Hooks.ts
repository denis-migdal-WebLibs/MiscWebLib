import { Extensions } from "..";
import { Hook, ObservationControllerClass, HookFactory } from "../@types/def";
import { OBS_CTRLER } from "../@types/internals";

function _createHook<
                        Meta extends Record<string, any> = {},
                        Args extends any[]               = []
                    >(
                        ObsCtrler: ObservationControllerClass,
                        metadata: Meta
                    ): Hook<Meta, Args> {

    const context = {} as {invoker: Meta};

    const obsCtrler = new ObsCtrler<Readonly<typeof context>, Args>(context);

    const hook = {
        ...metadata,
        [OBS_CTRLER]: obsCtrler
    };

    context.invoker = hook;

    return hook;
}

export const createHookExtension: Extensions["createHook"]
    = function(ObsCtrler) {
        return (...args) => _createHook(ObsCtrler, ...args);
    }


export const createOwnedHookExtension: Extensions["createOwnedHook"]
    = function(ObsCtrler) {
        return function createOwnedHook(owner, metadata = {} as any) {
        
            return _createHook(ObsCtrler, {
                owner,
                ...metadata,
            });
        }
    }

export const hookFactoryExtension: Extensions["hookFactory"]
    = function(ObsCtrler) {

        const HookFactory = {
            create<M extends Record<string, any>>(metadata: M) {
                return _createHook(ObsCtrler, metadata);
            }
        } satisfies HookFactory<[]>;

        return function hookFactory() {
            return HookFactory;
        }
    }

