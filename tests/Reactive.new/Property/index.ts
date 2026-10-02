import "@config";

import { assertEquals } from "std/assert/equals";
import { Property } from "MWL@2026/core/Reactive.new/Property";
import { ConstantController } from "MWL@2026/core/Reactive.new/Property/features/Controllers/Constant";
import { ValueController } from "MWL@2026/core/Reactive.new/Property/features/Controllers/Value";
import { addReactiveEffect } from "../ReactiveObject/index.ts";

Deno.test("Get", () => {
    const property = new Property(new ConstantController(42));

    // deno-lint-ignore no-constant-condition
    if( false ) {
        // @ts-expect-error: should not be defined for ROProperty.
        property.set(34)
    }

    assertEquals( property.get(), 42 );
});

Deno.test("Set", () => {
    const property = new Property(new ValueController(42));

    property.set(34);

    assertEquals( property.get(), 34 );
});

Deno.test("Set notify", () => {
    const property = new Property(new ValueController(42));

    let count = 0;
    addReactiveEffect(property, () => ++count);

    property.set(34);

    assertEquals( count, 1 );
});

Deno.test("Setx2 notifyx1", () => {
    const property = new Property(new ValueController(42));

    let count = 0;
    addReactiveEffect(property, () => ++count);

    property.set(34);
    property.set(34);

    assertEquals( count, 1 );
});