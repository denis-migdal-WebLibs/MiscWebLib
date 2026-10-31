const REACTION_NODE = Symbol();
type  REACTION_NODE = typeof REACTION_NODE;

export {REACTION_NODE};

export function reactionNode<T extends {[REACTION_NODE]: any}>(target: T) {
    return target[REACTION_NODE];
}