import { Callback } from "../CallbackRegistry";
import { Observable } from "./Observable";
import { listen, triggerCallback, unlisten } from "./observe";

//TODO move ?
function inPlaceRemove(target: any[], idx: number) {

    if( idx === -1 ) return;

    if(idx === target.length - 1) {
        --target.length;
        return;
    }

    target[idx] = target[target.length-1];
    --target.length;
}

// Listen to several sources at once (with the same callback).
// Not appropriate when additional context is required.
export class Observer<
                        T    extends object|null = any
                    > {

    readonly callback: Callback<T>;

    readonly targets = new Array<Observable<T>>();

    constructor(callback: Callback<T>) {
        this.callback = callback;
    }

    observe(target: Observable<T>) {
        this.listen(target);
        triggerCallback(target, this.callback, this);
    }

    listen(target: Observable<T>) {
        this.targets.push(target);
        listen(target, this.callback);
    }

    unlisten(target: Observable<T>) {

        const idx = this.targets.lastIndexOf(target);
        if( idx === -1 )
            return;

        // we don't care about order.
        inPlaceRemove(this.targets, idx);

        unlisten(target, this.callback);
    }
    unobserve(target: Observable<T>) {
        return this.unlisten(target);
    }

    clear() {
        for(let i = 0; i < this.targets.length; ++i)
            unlisten(this.targets[i], this.callback);

        this.targets.length = 0
    }
}