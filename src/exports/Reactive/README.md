```ts
class Foo extends ObservableObject {
    ...
}
const foo = new Foo();

listen (foo, () => {});
observe(foo, () => {}); // performs an initial call.

// internally:
trigger(foo, origin?);
```

## Variations

```ts
// delegate
class Faa extends ObservableProxy<Foo> {
    
    readonly foo: Foo;

    constructor() {
        const foo = new Foo();
        super( foo );
        
        this.foo = foo;
    }
}

// mixin
class Fuu extends ObservableMixin(BaseClass) {
    ...
}
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

## Observers

```ts
const arena = new ObservationArena();

arena.listen(...)
arena.observe(...)

arena.clear();
```

```ts
const observer = new Observer( () => {} );

observer.listen(target);
...
observer.unlisten(target);
```