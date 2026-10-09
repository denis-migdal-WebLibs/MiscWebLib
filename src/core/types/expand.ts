export type Expand<T> = T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

export function expand<T>(obj: T): Expand<T> {
    return obj as Expand<T>;
}