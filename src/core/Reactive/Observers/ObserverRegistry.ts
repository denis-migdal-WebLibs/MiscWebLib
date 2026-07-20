import { Callback } from "../CallbackRegistry";
import type { Event } from "../Event";
import { Observable } from "./Observable";
import { listen, unobserve } from "./observe";

// Register observer for easier cleanup.
export default class ObserverRegistry {

    private readonly targets   = new Array<any>();
    private readonly callbacks = new Array<any>();

    listen<T extends object|null = any >(
                        target: Observable<Event<T>>,
                        callback: Callback<T>
                    ) {

        this.targets  .push(target  );
        this.callbacks.push(callback);

        listen(target, callback);
    }
    
    clear() {
        for(let i = 0; i < this.targets.length ; ++i)
            unobserve(this.targets[i], this.callbacks[i]);

        this.targets  .length = 0;
        this.callbacks.length = 0;
    }

}