import { ReactiveObject } from "./ReactiveObject";

export type Link = {
    readonly src: ReactiveObject;
    readonly dst: ReactiveObject;
    propagate(this: Link): void;
}