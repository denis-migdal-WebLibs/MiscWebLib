import "@config";

import { assertEquals } from "std/assert";
import { ReactiveObject, addLink, pauseReactions, requestReaction, resumeReactions } from "MWL@2026/modules/Reactive/Reaction";

import { listen } from "MWL@2026/modules/Observable";

Deno.test("Reaction x1", () => {

    const obj = new ReactiveObject();

    let count = 0;
    listen(obj, () => ++count );

    requestReaction(obj);
    assertEquals(count, 1);
})

Deno.test("Pause (noop)", () => {

    const obj = new ReactiveObject();

    let count = 0;
    listen(obj, () => ++count);

    pauseReactions(obj);
    assertEquals(count, 0);
    resumeReactions(obj);
    assertEquals(count, 0);
});

Deno.test("Pause (multi-trigger)", () => {

    const obj = new ReactiveObject();

    let count = 0;
    listen(obj, () => ++count);

    pauseReactions(obj);

    requestReaction(obj);
    requestReaction(obj);

    assertEquals(count, 0);
    resumeReactions(obj);

    assertEquals(count, 1);
});

Deno.test("Pause (many)", () => {

    const obj  = new ReactiveObject();
    const obj2 = new ReactiveObject();

    addLink(obj, obj2);

    let count = 0;
    listen(obj2, () => ++count);

    pauseReactions(obj, obj2);
    {
        requestReaction(obj2);
        requestReaction(obj);

        assertEquals(count, 0);
    }
    resumeReactions(obj2, obj);

    assertEquals(count, 1);
});