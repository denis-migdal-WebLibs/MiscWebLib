export class RichEvent<
                    Name      extends string,
                    EventName extends keyof HTMLElementEventMap
                > {
    readonly name  : Name;
    readonly filter: (ev: HTMLElementEventMap[EventName]) => boolean;

    private readonly eventName: EventName;
    
    constructor(
                name: Name, eventName: EventName,
                filter: (ev: HTMLElementEventMap[EventName]) => boolean
            ) {
        this.name   = name;
        this.filter = filter;
        this.eventName = eventName;
    }

    attach(target: EventTarget, callback: () => void) {

        const listener = (ev: HTMLElementEventMap[EventName]) => {

            if( ! this.filter(ev) )
                return;

            ev.preventDefault();
            ev.stopImmediatePropagation();

            callback();
        };

        //@ts-ignore: ev type isn't properly deduced.
        target.addEventListener(this.eventName, listener);
    }
}