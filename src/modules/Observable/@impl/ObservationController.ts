import { ObservableDetails } from "MWL@2026/modules/Observable/@contract";
import { Callback, ObservationController as ObsCtrlerContract, Prefixes } from "MWL@2026/modules/Observable/@contract/@types/def";
import { NULL_OP } from "MWL@2026/@exports/types";

export const ObservationController: ObservableDetails["ObservationController"]
    = class<
            CallbackCtx  extends object|void,
            CallbackArgs extends any[]
        > implements ObsCtrlerContract<CallbackCtx, CallbackArgs> {
    
    constructor(
                ...args: [CallbackCtx]|(CallbackCtx extends void ? [] : never)
            ) {
        this.callbackCtx = args[0]!;
    }

    // === trigger ===

    private readonly callbackCtx : CallbackCtx;
    private readonly callbacks=new Array<Callback<CallbackCtx,CallbackArgs>>();

    trigger(...args: CallbackArgs) {

        // need to compact to avoid growing callback list.
        this.compactCallbacks();

        // we could bind...
        for(let i = 0; i < this.callbacks.length; ++i)
            this.callbacks[i].apply(this.callbackCtx, args);
    }

    canSkipTrigger() {
        this.compactCallbacks();
        return this.callbacks.length === 0;
    }

    call<A extends Prefixes<CallbackArgs>>(
                                callback: Callback<CallbackCtx, A>,
                                ...args: A
                            ) {
        callback.apply(this.callbackCtx, args);
    }

    // === callbacks ===

    has(callback: Callback<CallbackCtx, CallbackArgs>) {
        return this.callbacks.includes(callback);
    }
    add(callback: Callback<CallbackCtx, CallbackArgs>){
        this.callbacks.push(callback);
    }

    remove(callback: Callback<CallbackCtx, CallbackArgs>): void {

        //TODO lazyRemove()...
        const idx = this.callbacks.indexOf(callback);
        if( idx === -1)
            return;

        this.callbacks[idx] = NULL_OP;
        this.removalPending = true;
    }
    
    // do NOT call it during trigger
    clear() {
        this.callbacks.length = 0;
        this.removalPending = false;
    }

    private removalPending = false;
    private compactCallbacks() {

        if( ! this.removalPending ) // compact only if necessary.
            return;

        let offset = 0;
        for(let i = 0; i < this.callbacks.length; ++i)
            if( this.callbacks[i] !== NULL_OP)
                this.callbacks[offset++] = this.callbacks[i];

        this.callbacks.length = offset;
        this.removalPending = false;
    }
}
export type  ObservationController<
                    TriggerContext extends object|void = void,
                    Args extends any[] = []
                > = ObsCtrlerContract<TriggerContext, Args>;