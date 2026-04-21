import { assert } from "std/assert";

// @deno-types="@/index.d.ts"
import foo from "@/index.js";

Deno.test("my_test", () => {
    assert( foo() === 42 );
});