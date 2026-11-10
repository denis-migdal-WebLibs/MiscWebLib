import { REACTIVE_NODE } from "../../ReactiveObject/ReactiveObject";
import { triggerReactiveObject } from "../../ReactiveObject/ReactiveScheduler";
import { Property } from "../Property";
import { RWPropertyController } from "../PropertyController";
import { PropertyValue } from "../PropertyValue";
import { addSyncLink } from "./links";

export function forward<T, U>(
                        src: Property<T>,
                        dst: Property<U>,
                        callback: (value: T) => U
                    ): void;
export function forward<T>(src: Property<T>, dst: Property<T>): void;
export function forward<T, U>(
                        src: Property<T>,
                        dst: Property<U>,
                        callback?: (value: T) => U
                    ) {

    __ASSERT__( ! dst.isRO, "Dst property is RO !");
    
    (dst.controller as RWPropertyController<U>).clearValue();

    let value = src.value as any as PropertyValue<U>;
    //TODO: add cache...
    if( callback !== undefined )
        value = {
            get() {
                return callback(src.value.get())
            }
        }

    dst.value = value;

    // before links to avoid triggering src
    triggerReactiveObject(dst);

    if( callback !== null ) {
        src[REACTIVE_NODE].links.push({
            src,
            dst,
            propagate() {
                (dst.controller as RWPropertyController<U>).clearValue();
                dst.value = value;
            },
        })
    } else {
        addSyncLink(src, dst);
    }
}