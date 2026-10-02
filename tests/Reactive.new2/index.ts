import "@config";

import { assertEquals } from "std/assert/equals";
import { ReactiveValue } from "MWL@2026/core/Reactive.new2/Property/ValueProperty.ts";
import { addReactiveEffect } from "../Reactive.new/ReactiveObject";



Deno.test("Reactive", () => {
    const val = new ReactiveValue(43);

    let count = 0;
    addReactiveEffect(val, () => {
        ++count;
    })

    val.set(44);
    
    assertEquals(count, 1);
});