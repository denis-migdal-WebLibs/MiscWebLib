import "@config";

import { assertEquals } from "std/assert";

import {properties} from "MWL@2026/modules/Reactive/Collections/Properties";
import {PropertiesRenderer} from "MWL@2026/modules/Reactive/PropertiesRenderer";
import { Value } from "MWL@2026/modules/Reactive/Property";

Deno.test("Render", () => {

    const props = properties({foo: Value(42)});
    
    const effects = new PropertiesRenderer(props);

    let count = 0;
    effects.addRule(["foo"], () => ++count);

    props.foo = 43;

    effects.render();
    effects.render();

    assertEquals( count, 1 );
});