
export default function instanceResolver<E extends HTMLElement>(instance: E) {
    return (target: HTMLElement) => {
        if(__DEBUG__ && target.localName !== "wc-placeholder") {
            throw new Error(`Target isn't a placeholder`);
        }

        return instance;
    }
}