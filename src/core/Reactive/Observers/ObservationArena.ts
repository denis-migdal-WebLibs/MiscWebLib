import { Callback } from "../CallbackRegistry";
import { Observable } from "./Observable";
import { listen, triggerCallback, unlisten } from "./observe";

// Register observer for easier cleanup.
export default class ObservationArena {

    private readonly targets   = new Array<any>();
    private readonly callbacks = new Array<any>();

    listen<T extends object|null = any >(
                        target: Observable<T>,
                        callback: Callback<T>
                    ) {

        this.targets  .push(target  );
        this.callbacks.push(callback);

        listen(target, callback);
    }

    observe<T extends object|null = any >(
                        target: Observable<T>,
                        callback: Callback<T>
                    ) {
        this.listen(target, callback);
        triggerCallback(target, callback, this);
    }
    
    clear() {
        for(let i = 0; i < this.targets.length ; ++i)
            unlisten(this.targets[i], this.callbacks[i]);

        this.targets  .length = 0;
        this.callbacks.length = 0;
    }

}