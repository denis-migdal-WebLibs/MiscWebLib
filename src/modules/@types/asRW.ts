// Not used currently.
// Enables to define custom RO -> RW castings.

export interface asRW {}

function asRW(a: unknown) {
    return a;
}

export {asRW};