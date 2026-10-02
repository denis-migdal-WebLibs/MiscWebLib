import "@config";

import { assertEquals } from "std/assert/equals";
import { ReactiveObject, requestReaction } from "MWL@2026/core/Reactive.new/Scheduler/index.ts";
import { REACTIVE_NODE } from "MWL@2026/core/Reactive.new/Scheduler/@contract/internals.ts";

Deno.test("Reactive", () => {
    let count = 0;
    const obj = new ReactiveObject(() => ++count);

    requestReaction(obj);

    assertEquals(count, 1);
})

export function addReactiveEffect(target: ReactiveObject, callback: () => void) {

    const dst = new ReactiveObject( callback );

    target[REACTIVE_NODE].outgoingLinks.push({
        src: target,
        dst,
        data: {} as any
    });
}

Deno.test("Link", () => {

    let count = 0;

    const obj = new ReactiveObject(() => ++count);
    addReactiveEffect(obj, () => ++count );

    requestReaction(obj);

    assertEquals(count, 2);
})