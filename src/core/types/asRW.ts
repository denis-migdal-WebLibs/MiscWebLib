// Not used currently.
// Enables to define custom RO -> RW castings.

export interface TasRW {}

function asRW(a: unknown) {
    return a;
}

export default asRW as TasRW;