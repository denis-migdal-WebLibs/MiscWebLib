import { triggerReactiveObject } from "../../ReactiveObject/ReactiveScheduler";
import { Property } from "../Property";
import { RWPropertyController } from "../PropertyController";
import { addSyncLink } from "./links";

export function bind<T>(src: Property<T>, dst: Property<T>) {

    if( __DEBUG__ && ( src.isRO || dst.isRO ) )
        throw new Error("RO property !");
    
    (dst.controller as RWPropertyController<T>).clearValue();
    dst.value = src.value;

    // before links to avoid triggering src
    triggerReactiveObject(dst);
    
    addSyncLink(src, dst);
    addSyncLink(dst, src);
}