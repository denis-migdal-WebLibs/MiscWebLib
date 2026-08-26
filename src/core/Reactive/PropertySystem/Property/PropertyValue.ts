type ValidationError<T> = {
    value     : T,
    validation: string,
}

export interface PropertyValue<T> {
    get(): T;
    validate?(): true|ValidationError<T>;
}