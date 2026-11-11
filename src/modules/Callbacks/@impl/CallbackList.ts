import { NULL_OP } from "MWL@2026/@exports/types";
import { CallbacksDetails } from "../@contract";
import { Callback } from "../@contract/@types";
import { CallbackList } from "../@contract/@types/CallbackList";
import { CALLBACKS } from "../@contract/@types/WithCallbacks";

const CallbackList: CallbacksDetails["CallbackList"]
    = class <CallbackArgs extends any[]> implements CallbackList<CallbackArgs> {

        readonly [CALLBACKS] = this;

        private readonly callbacks = new Array<Callback<CallbackArgs>>();
        private nbRemovePending    = 0;
        
        get size() {
            return this.callbacks.length - this.nbRemovePending;
        }

        trigger(...args: CallbackArgs) {

            this.compactCallbacks();

            for(let i = 0; i < this.callbacks.length; ++i)
                this.callbacks[i](...args);
        }

        has(callback: Callback<CallbackArgs>) {
            return this.callbacks.includes(callback);
        }
        add(callback: Callback<CallbackArgs>){
            this.callbacks.push(callback);
        }

        remove(callback: Callback<CallbackArgs>): void {

            const idx = this.callbacks.indexOf(callback);
            if( idx === -1)
                return;

            this.callbacks[idx] = NULL_OP;
            ++this.nbRemovePending;
        }
        
        // do NOT call it during trigger
        clear() {
            this.callbacks.length = 0;
            this.nbRemovePending  = 0;
        }

        private compactCallbacks() {

            if( this.nbRemovePending === 0 ) // compact only if necessary.
                return;

            let offset = 0;
            for(let i = 0; i < this.callbacks.length; ++i)
                if( this.callbacks[i] !== NULL_OP)
                    this.callbacks[offset++] = this.callbacks[i];

            this.callbacks.length = offset;
            this.nbRemovePending  = 0;
        }
    }

export {CallbackList};