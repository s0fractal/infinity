import { identity } from "./𝟏.ts";
import { select } from "./⍰.ts";
import { and } from "./∧.ts";
import { not } from "./¬.ts";
import { apply } from "./@.ts";
import { pair } from "./⊗.ts";
import { lambda } from "./λ.ts";

//⭘
export const O = {
    '𝟏': identity,  //Identity
    '@': apply,     // Application
    'λ': lambda,    // Abstraction
    '∧': and,       // And
    '¬': not,       // Not
    '?': select,    // Query Selection
    '⊗': pair       // Pair
} as const;
