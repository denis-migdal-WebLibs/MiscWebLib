import "@config";

import { assertEquals } from "std/assert/equals";
import { forwardValue, ImmutableProperty, ValueProperty } from "MWL@2026/core/Reactive.new/Property";
import { addReactiveEffect } from "MWL@2026/core/Reactive.new/Reaction";
import { syncValue } from "MWL@2026/core/Reactive.new/Property/@details/Links/ValueLinks.ts";

Deno.test("Get", () => {
    const property = new ImmutableProperty(42);
    assertEquals( property.get(), 42 );
});

Deno.test("Set", () => {
    const property = new ValueProperty(42);

    property.set(34);

    assertEquals( property.get(), 34 );
});

Deno.test("Set notify", () => {
    const property = new ValueProperty(42);

    let count = 0;
    addReactiveEffect(property, () => ++count);

    property.set(34);

    assertEquals( count, 1 );
});

Deno.test("Set x2 notify x1", () => {
    const property = new ValueProperty(42);

    let count = 0;
    addReactiveEffect(property, () => ++count);

    property.set(34);
    property.set(34);

    assertEquals( count, 1 );
});

Deno.test("Set x2 notify x2", () => {

    const property = new ValueProperty(0);

    let count = 0;
    addReactiveEffect(property, () => ++count);

    property.set(42);
    property.set(43);

    assertEquals(count, 2);
});

Deno.test("Forward", () => {

    const A = new ValueProperty(1);
    const B = new ValueProperty(2);

    forwardValue(A, B);
    
    assertEquals( A.get(), B.get() );

    A.set(3);
    
    assertEquals( B.get(), 3 );

    B.set(4);
    
    assertEquals( B.get(), 4 );
    assertEquals( A.get(), 3 );

    A.set(5);
    
    assertEquals( B.get(), 5 );
});

Deno.test("Sync", () => {

    const A = new ValueProperty(1);
    const B = new ValueProperty(2);

    syncValue(A, B);
    
    assertEquals( A.get(), B.get() );

    A.set(3);
    
    assertEquals( A.get(), 3 );
    assertEquals( B.get(), 3 );

    B.set(4);
    
    assertEquals( B.get(), 4 );
    assertEquals( A.get(), 4 );
});

Deno.test("Bind xN", () => {

    const array = new Array<ValueProperty<number>>(10);
    for(let i = 0; i < array.length; ++i)
        array[i] = new ValueProperty(i);

    for(let i = 1; i < array.length; ++i)
        syncValue(array[i-1], array[i]);

    const first = array[0];
    const last  = array[array.length -1];
    
    assertEquals( first.get(), last.get() );

    first.set(3);

    assertEquals( first.get(), last.get() );
    
    last.set(4);
    
    assertEquals( first.get(), last.get() );
});

Deno.test("Bind notify x2", () => {
    
    const A = new ValueProperty(1);
    const B = new ValueProperty(2);

    syncValue(A, B);

    let count = 0;
    addReactiveEffect(A, () => ++count );

    A.set(2);
    B.set(3);

    assertEquals(count, 2);
});