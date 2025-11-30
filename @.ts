export const apply = <A, B>(f: (a: A) => B, x: A): B => f(x);
export const $ = apply;
export const invoke = apply;