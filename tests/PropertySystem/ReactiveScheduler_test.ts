import "@config";

import { assertEquals } from "std/assert";
import { ReactiveObject } from "MWL@2026/core/Reactive/PropertySystem/ReactiveObject/ReactiveObject.ts";
import { pauseReactions2, resumeReactions2, triggerReactiveObject } from "MWL@2026/core/Reactive/PropertySystem/ReactiveObject/ReactiveScheduler.ts";
import { listen } from "MWL@2026/core/Reactive/Observers/observe.ts";

Deno.test("Pause", () => {

    const obj = new ReactiveObject();

    let count = 0;
    listen(obj, () => ++count);

    pauseReactions2(obj);

    triggerReactiveObject(obj);
    triggerReactiveObject(obj);

    assertEquals(count, 0);
    resumeReactions2(obj);

    assertEquals(count, 1);
});