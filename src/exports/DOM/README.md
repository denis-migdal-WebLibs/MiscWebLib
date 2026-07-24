```ts
const elements = resolve(target, {
        foo: HTMLElement, // check
        faa: myelement,   // set
        fuu: (e) => ...   // check/set.
    });

elements.foo; // data-wcid='foo'
```