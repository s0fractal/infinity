import { identity } from "./𝟏.ts"
//⭘
export const O = {
    '𝟏': identity,  //Identity
    '@': (f, x) => f(x),     // Application
    'λ': (body) => (x) => body(x),  // Abstraction
    '∧': (a, b) => a && b,   // And
    '¬': (x) => !x,          // Not
    '?': (p, t, f) => p ? t : f,    // Query Selection
    '⊗': (a, b) => [a, b]    // Pair
} as const;
