## Frequently used types

- classes:
  - `Cstr<object, [...args]>`: represents a class constructor.
  - `Constructible<object, [...args]>`: represents a factory (class or function).
  - `isClass<object, [...args]>(o)`: type guard.
- `Mutable<T>`/`mutable(t)`: makes an object mutable.

## Tips

```ts
interface {
    (): void
}
```

Somehow describes a function, enables to overload it in several places.