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