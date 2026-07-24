```ts
const WC = defineWebComponent({
    name      : "my-wc",
    Controller: ...

    style   : __LOAD_FILE__(...),
    content : __LOAD_FILE__(...),
    elements: {
        name: HTMLElement // data-wcid='name'
    },

    initialize: function(controller) {
        const renderer = createPropertiesDeferredRenderer(controller, this.renderer);

        renderer.bind("foo", () => {});
        renderer.after( () => {});
        
        // ...
    }
});
```