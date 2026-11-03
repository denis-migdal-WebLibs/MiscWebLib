export interface PropertyDetails {

    ValueProperty    : new() => {};
    ImmutableProperty: new() => {};

    PropertiesRecord: new() => {};

    //TODO: services (redir API)
    forwardValue(): void;
    syncValue   (): void;
}

export interface PropertyImpl extends PropertyDetails {}

export interface PropertyContract
                    extends PropertyDetails {}