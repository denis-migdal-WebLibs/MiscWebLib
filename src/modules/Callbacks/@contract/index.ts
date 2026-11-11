import { WithCallbacks } from "./@types";
import { CallbackList } from "./@types/CallbackList";

export interface CallbacksTypes {
    getCallbacks<CallbackArgs extends any[] = []>(target: WithCallbacks<CallbackArgs>): CallbackList<CallbackArgs>|null;
}

export interface CallbacksDetails {

    CallbackList: new <CallbackArgs extends any[] = []>() => CallbackList<CallbackArgs>;

    // helpers...
    /*
        ~> plus observable avec ses dérivées ???
    listen<CallbackArgs extends any[] = []>(
                                    target  : WithCallbacks<CallbackArgs>,
                                    callback: Callback<CallbackArgs>
                                ): void;
    */
}

export interface CallbacksContract extends CallbacksDetails, CallbacksTypes {}