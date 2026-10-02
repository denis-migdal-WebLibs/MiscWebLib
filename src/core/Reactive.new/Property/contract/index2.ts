import { ReactiveObject } from "../../Scheduler";
import { Link } from "../../Scheduler/@contract";

export type ValueProvider<T> = { get(): T; readonly isResolved: boolean };

export type ImmutableProperty<T> = ValueProvider<T>;

export type ValueProperty<T> = ImmutableProperty<T> & {
    set(value: T): void;
    setSource(source: ValueProvider<T>): void;

    readonly source: ValueProvider<T>
}

// can't use ValueProperty => setSource is DANGEROUS.
export type ReactiveValueProperty<T> = ReactiveObject<Link>
                                        & ImmutableProperty<T>
                                        & {
                                            set(value: T): void
                                        };

type RWPropertyLink = Link;
export type RWProperty<T> = ImmutableProperty<T>
                            & ReactiveObject<RWPropertyLink>
                            & {
                                set(value: T): void;
                            }

export type PropertyLink<T> = Link & ValueProvider<T>;