
export function instanceResolver<E extends HTMLElement>(instance: E) {
    return (target: HTMLElement) => {

        __ASSERT__(target.localName === "wc-placeholder",
                    `Target isn't a placeholder`);

        return instance;
    }
}