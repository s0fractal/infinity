export const lambda = <A, B>(f: (a: A) => B): (a: A) => B => f;
export const abstract = lambda;
export const fun = lambda;