// ﹫file: ⭘.ts
//
// This file defines the ⭘ (Base Layer) for the λ⁷ Tensor Field.
// It exports the 7 fundamental morphisms as an immutable object `O`,
// and provides reusable TypeScript types for these morphisms and their identifiers.

import { identity } from "./𝟏.ts"; // Assuming 𝟏.ts exports 'identity'
import { select } from "./⍰.ts";   // Assuming ⍰.ts exports 'select'
import { and } from "./∧.ts";     // Assuming ∧.ts exports 'and'
import { not } from "./¬.ts";     // Assuming ¬.ts exports 'not'
import { apply } from "./﹫.ts";     // Assuming ﹫.ts exports 'apply'
import { pair } from "./⊗.ts";      // Assuming ⊗.ts exports 'pair'
import { lambda } from "./λ.ts";    // Assuming λ.ts exports 'lambda'

/**
 * The immutable object `O` (for Omega or Operator) represents the 7 fundamental
 * λ⁷ morphisms of the Base Layer (⭘). Each key is the glyph, and the value
 * is its corresponding executable function/morphism.
 *
 * This object is declared with `as const` to ensure its keys and values
 * are treated as literal types, enabling precise type inference.
 */
export const O = {
    '𝟏': identity,  // Identity (I)
    '﹫': apply,     // Application (﹫)
    'λ': lambda,    // Abstraction (λ)
    '∧': and,       // Logical AND (∧)
    '¬': not,       // Logical NOT (¬)
    '⍰': select,    // Selection / Query (?)
    '⊗': pair       // Pairing (⊗)
} as const;

/**
 * Type alias for the literal string keys of the 7 fundamental λ⁷ morphisms.
 * This provides a precise type for referring to the glyphs themselves.
 * E.g., '𝟏', '﹫', 'λ', '∧', '¬', '⍰', '⊗'.
 */
export type Lambda7MorphismKey = keyof typeof O;

/**
 * Type alias for a union of the values (the executable functions/morphisms)
 * exported by the 7 fundamental λ⁷ glyphs.
 * This represents the type of any single primitive morphism from the Base Layer.
 */
export type Lambda7MorphismValue = typeof O[Lambda7MorphismKey];

/**
 * Type alias for a single λ⁷ morphism, combining both its identifier (key)
 * and its executable value (function). This can be used for more comprehensive
 * type definitions where both aspects are relevant.
 * E.g., { key: 'λ', value: typeof lambda }
 */
export type Lambda7Morphism = {
  [K in Lambda7MorphismKey]: { key: K; value: typeof O[K] }
}[Lambda7MorphismKey];