import { NULL_OP } from "MWL@2026/core/types";

export default class GuardedState {

    private enterCallback: () => void;
    private leaveCallback: () => void;

    private _isInside = false;
    get isInside() {
        return this._isInside;
    }

    constructor(
                enterCallback: () => void,
                leaveCallback: () => void = NULL_OP
            ) {
        this.enterCallback = enterCallback;
        this.leaveCallback = leaveCallback;
    }

    enter() {
        if( this._isInside === true )
            return;

        this._isInside = true;
        this.enterCallback();
    }

    leave() {
        if( this._isInside === false )
            return;

        this.leaveCallback();
        this._isInside = false;
    }

    cancel() {
        this._isInside = false;
    }
}