const REACTION_NODE = Symbol();
type  REACTION_NODE = typeof REACTION_NODE;

export {REACTION_NODE};

export function reactionNode<T extends {readonly [REACTION_NODE]: any}>(target: T): T[REACTION_NODE] {
    return target[REACTION_NODE];
}