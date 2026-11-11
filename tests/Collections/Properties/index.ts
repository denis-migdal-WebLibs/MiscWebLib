import "@config";
import { assertEquals } from "std/assert";

import {properties} from "MWL@2026/modules/Reactive/Collections/Properties";

import { Constant, Computed, Value, updateProperties } from "MWL@2026/modules/Reactive/Property"
import { listen } from "MWL@2026/modules/Observable";

Deno.test("Get", () => {

    const props = properties({foo: Value(42)});

    assertEquals( props.foo, 42 );
});

Deno.test("Update", () => {

    const props = properties({
        foo: Value(42),
        faa: Value(42),
        fuu: Constant(42)
    });

    let count = 0;
    listen(props, () => ++count);

    updateProperties(props, {foo: 34, faa: 34});

    assertEquals(count, 1);
});

Deno.test("View", () => {

    const props = properties({
        foo: Value(42),
        faa: Computed(["foo"], (value: number) => { return value*2 })
    });

    assertEquals( props.faa, 84 );
});

Deno.test("JSON", () => {

    const props = properties({
        foo: Value(42),
        faa: Computed(["foo"], (value: number) => { return value*2 })
    });

    assertEquals( JSON.stringify(props), '{"foo":42,"faa":84}' );
});