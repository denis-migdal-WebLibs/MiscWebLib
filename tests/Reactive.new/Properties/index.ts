import "@config";
import { assertEquals } from "std/assert";

import {Properties, updateProperties} from "MWL@2026/core/Collections.new/Properties";
import { Value } from "MWL@2026/core/Reactive.new/Property/@details/Properties/ValueProperty.ts";
import { View } from "MWL@2026/core/Reactive.new/Property/@details/Properties/ViewProperty.ts";

import { Constant } from "MWL@2026/core/Reactive.new/Property/@details/Properties/ImmutableProperty.ts";
import { listen } from "MWL@2026/@exports/Observable/index.ts";
import { Property } from "MWL@2026/core/Reactive/PropertySystem/Property/Property.ts";

Deno.test("Get", () => {

    const properties = Properties({foo: Value(42)});

    assertEquals( properties.foo, 42 );
});

Deno.test("Update", () => {

    const properties = Properties({
        foo: Value(42),
        faa: Value(42),
        fuu: Constant(42)
    });

    let count = 0;
    listen(properties, () => ++count);

    updateProperties(properties, {foo: 34, faa: 34});

    assertEquals(count, 1);
});

Deno.test("View", () => {

    const properties = Properties({
        foo: Value(42),
        faa: View(["foo"], (value: Property<number>) => { return value.get()*2 })
    });

    assertEquals( properties.faa, 84 );
});

/*
Deno.test("JSON", () => {

    const properties = Properties({
        foo: Value(42),
        faa: View("foo", (value: number) => { return value*2 })
    });

    assertEquals( JSON.stringify(properties), '{"foo":42,"faa":84}' );
})
*/