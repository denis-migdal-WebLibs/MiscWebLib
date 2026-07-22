```ts
class Foo extends WithMainEvent() {
    ...
}
const foo = new Foo();

listen (foo, () => {});
observe(foo, () => {}); // performs an initial call.

// internally:
trigger(foo, origin?);
```

## Context

The callback is called with a this context with:
- `event`: the triggered event.
- `target`: the object (or null) provided at the creation of the event.
- `origin`: arbitrary value provided during trigger (used to avoid loop).

## Event

You can define other events:
```ts
const event = createEvent();

listen(event, () => {});
trigger(event, origin?);
```