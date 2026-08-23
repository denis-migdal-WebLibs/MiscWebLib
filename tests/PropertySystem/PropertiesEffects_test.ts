import "@config";

import {Properties} from "MWL@2026/core/Reactive/PropertySystem/Properties/Properties.ts";
import {PropertiesEffects} from "MWL@2026/core/Reactive/PropertySystem/Properties/PropertiesEffects.ts";
import { Value } from "MWL@2026/core/Reactive/PropertySystem/Controllers/Value.ts";
import { assertEquals } from "std/assert";

Deno.test("Render", () => {

    const properties = Properties({foo: Value(42)});
    
    const effects = new PropertiesEffects(properties);

    let count = 0;
    effects.add("foo", () => ++count);

    properties.foo = 43;

    effects.render();
    effects.render();

    assertEquals( count, 1 );
});