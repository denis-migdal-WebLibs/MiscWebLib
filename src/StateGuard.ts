export default class StateGuard {

    private enterCallback: () => void;
    private leaveCallback: () => void;

    private isInside = false;

    constructor(enterCallback: () => void, leaveCallback: () => void) {
        this.enterCallback = enterCallback;
        this.leaveCallback = leaveCallback;
    }

    enter() {
        if( this.isInside === true )
            return;

        this.isInside = true;
        this.enterCallback();
    }

    leave() {
        if( this.isInside === false )
            return;

        this.isInside = false;
        this.leaveCallback();
    }

    cancel() {
        this.isInside = false;
    }
}