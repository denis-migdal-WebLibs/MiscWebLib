- `createPropertiesFactory(desc)`: returns a factory in to build Properties as described by desc (initial values can be provided).
  - `PropertiesStore(src, proxy_cstr)`
  - `PropertiesProxy`: a `ValuesProxy` for `PropertiesStore`.
  - `ValuesProxy`: an efficient proxy to a `ProxyTarget` providing `get(name)` and `set(name, value, source)` methods:
    ```ts
    type T = {name: string, surname: string};
    const Proxy = createProxyClass<T>("name", "surname");

    const values = new Proxy({
                                  get(name) {...}
                                  set(name, value){...}
                              })
    
    // use it as a normal object:
    values.name = "John";
    ```