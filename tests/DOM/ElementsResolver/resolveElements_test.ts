import "@config";
import { assertEquals } from "std/assert";
import { parseHTML }    from "npm/linkedom";

import resolveElements from "@/DOM/ElementsResolver/resolveElements.ts";

const { document } = parseHTML("");
const div = document.createElement("div");


Deno.test("simple resolver", () => {
    const result = resolveElements(
        {
            foo: div
        },
        {
            foo: (e: HTMLElement) => e
        }
    );

    assertEquals(result, {foo: div});
});