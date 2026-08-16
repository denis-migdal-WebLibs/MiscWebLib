import "@config";

import {Properties} from "MWL@2026/core/Reactive/PropertySystem/Properties/Properties.ts";
import {PropertiesRenderer} from "MWL@2026/core/Reactive/PropertySystem/Properties/PropertiesRenderer.ts";
import { Value } from "MWL@2026/core/Reactive/PropertySystem/Controllers/Value.ts";
import { assertEquals } from "std/assert";

Deno.test("Render", () => {

    const properties = Properties({foo: Value(42)});
    
    const renderer = new PropertiesRenderer(properties);

    let count = 0;
    renderer.addEffect("foo", () => ++count);

    properties.foo = 43;

    renderer.render();
    renderer.render();

    assertEquals( count, 1 );
});