export const select = <T>(p: boolean, a: T, b: T): T => p ? a : b;
export const choose = select;