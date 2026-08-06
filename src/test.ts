// @ts-nocheck

import { listen } from "MWL@2026:core/Reactive/Observers";
import { Value } from "MWL@2026:core/Reactive/Properties/Controllers";
import { createProperties } from "MWL@2026:core/Reactive/Properties/Properties/createProperties";
import { Properties } from "MWL@2026:exports/Reactive/Properties";

/*
type IfEquals<X, Y, A = true, B = false> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2)
        ? A
        : B;

type IsReadonly<T, K extends keyof T> =
    IfEquals<
        { [P in K]: T[P] },
        { -readonly [P in K]: T[P] },
        false,
        true
    >;

type Test<T extends Record<string, any>> = {
    -readonly[K in keyof T]: IsReadonly<T, K>;
}
*/

type IfEquals<X, Y, A = true, B = false> =
    (<T>() => T extends X ? 1 : 2) extends
    (<T>() => T extends Y ? 1 : 2)
        ? A
        : B;

type ReadonlyKeys<T> = {
    [K in keyof T]-?:
        IfEquals<
            { [P in K]: T[K] },
            { -readonly [P in K]: T[K] },
            never,
            K
        >
}[keyof T];

type WritableKeys<T> = Exclude<keyof T, ReadonlyKeys<T>>;


type Test<T extends Record<string, any>> = Expand<{
    [K in WritableKeys<T>]: {set: () => void}
} & {
    [K in ReadonlyKeys<T>]: {}
}>

type Z = Test<{foo: 34, readonly faa: "e"}>;

type ROProps<T> = {[K in keyof T]: {} };
type RWProps<T> = {[K in keyof T]: { set(): boolean } };

type ROKeys<T extends Record<string, {set?(): boolean}>> = keyof {
    [K in keyof T as T[K] extends {set():boolean} ? never: K]: any
}
type RWKeys<T extends Record<string, {set?(): boolean}>> = Exclude<keyof T, ROKeys<T>>;

type AsProps<T extends Record<string, {set?(): boolean}>> = {
    readonly [K in ROKeys<T>]: T[K]
} & {
    [K in RWKeys<T>]: T[K]
}

function faa<
                T extends Record<string, {set?(): boolean}>
            >( desc: T): Expand<AsProps<T>> {
    return {} as any;
}

const e = faa({} as {foo: {}, faa: { set(): false}});

const props = expand(createProperties({
    foo: Value(44)
}));

type Expand<T> = T extends infer O
    ? { [K in keyof O]: O[K] }
    : never;

function expand<T>(t: T): Expand<T> { return t as any; };

const a: Properties<{readonly foo: number}> = props;
const b = expand(a);

listen(b, () => {});