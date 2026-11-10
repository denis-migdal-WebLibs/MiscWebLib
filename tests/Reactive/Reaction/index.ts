import "@config";

import { assertEquals } from "std/assert";
import { ReactiveObject, addLink, pauseReactions, requestReaction, resumeReactions, attachReactionEffect } from "MWL@2026/modules/Reactive/Reaction";

Deno.test("Reaction x1", () => {

    const obj = new ReactiveObject();

    let count = 0;
    attachReactionEffect(obj, () => ++count );

    requestReaction(obj);
    assertEquals(count, 1);
})

Deno.test("Pause (noop)", () => {

    const obj = new ReactiveObject();

    let count = 0;
    attachReactionEffect(obj, () => ++count);

    pauseReactions(obj);
    assertEquals(count, 0);
    resumeReactions(obj);
    assertEquals(count, 0);
});

Deno.test("Pause (multi-trigger)", () => {

    const obj = new ReactiveObject();

    let count = 0;
    attachReactionEffect(obj, () => ++count);

    pauseReactions(obj);

    requestReaction(obj);
    requestReaction(obj);

    assertEquals(count, 0);
    resumeReactions(obj);

    assertEquals(count, 1);
});

Deno.test("Pause (many)", () => {

    console.warn("=== HERE ===");

    const obj  = new ReactiveObject();
    const obj2 = new ReactiveObject();

    addLink(obj, obj2);

    let count = 0;
    attachReactionEffect(obj2, () => ++count);

    pauseReactions(obj2, obj);
    {
        requestReaction(obj2);
        requestReaction(obj);

        assertEquals(count, 0);
    }
    resumeReactions(obj2, obj);

    assertEquals(count, 1);
});