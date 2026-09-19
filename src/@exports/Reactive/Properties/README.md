## Create properties

```ts
// Describe the properties.
const factory = createPropertiesFactory({
                                foo: Value<number>(42),
                            });

const data = factory({foo: 24}); // Give initial values.

// use it as a normal object:
data.foo = 42;

// data is Observable:
observe(data, () => { ... });

// batch changes:
updateProperties(data, {
    foo: 42,
    // ...
});
```

## Controllers

Several kind of Properties:
- `Value<T>(defVal)`: triggers when the value change.
- `Signal<T>(defVal)`: triggers upon each assignations.
- `Fixed<T>(defVal)`: ignore assignation.
- `Constant<T>(value)`: ignore assignation and provided value.
- `View<T, U>(propname, (value) => value)`: computed from another property.

## Synchronisation

You can synchronise properties:
```ts
syncProperty( getProperty(data, "foo"),
              getProperty(atad, "faa") );
```

## WithProperties

You can create an observable classe with a readonly `.properties` attribute:
```ts
class X extends WithProperties({...}) {}
```

You can build functions accepting either a `Properties` or an object with properties thanks to:
- `PropertiesProvider<T>`: either a `Properties<T>` or a `WithProperties<T>`.
- `getProperties(x)`: get the properties of a `PropertiesProvider<T>`.

## PropertiesRenderer

Associate some properties with an action.

```ts
const renderer = new PropertiesRenderer(data);

renderer.bind("foo", () => { ... });
renderer.bind(["foo", "faa"], () => { ... });

renderer.render(); // check properties and execute associated bindings.
```

## Types

Note: standalone `Property` not implemented (would inherit `PropertySlot` and `Observable`). Then, will need some `new ValueProperty()` classes.

- `Properties<Record<string, any>>`: a record of properties.
- `PropertySlot<T>`: a property (a stable reference to a `PropertyController<T>`).
- `PropertyController<T>`: a property behavior, can be shared when properties are synced.
- `PropertyDescriptor<T>`/`PropertiesDescriptors<T>`: create instances of `PropertyController<T>` for a given `Properties<Record<string, any>>`.
- `GetPropertiesType<T>`: extracts the `Record<string, any>` from a `PropertiesDescriptors<T>`.