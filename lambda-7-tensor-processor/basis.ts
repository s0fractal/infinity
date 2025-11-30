// basis.ts
// Defines the 8 fundamental morphisms of the Σλ⁸ calculus.

export enum Morphism {
  I,      // 0: Identity - The neutral element, represents data or a no-op.
  Apply,  // 1: @ - Application, applies a function to an argument.
  Lambda, // 2: λ - Abstraction, creates a function.
  And,    // 3: ∧ - Conjunction, boolean AND.
  Not,    // 4: ¬ - Negation, boolean NOT.
  Cond,   // 5: ? - Conditional, ternary if/else.
  Pair,   // 6: ⊗ - Pairing/Tensor, creates a data structure (tuple/pair).
  Void,   // 7: _VOID_ - The empty glyph, potentiality, 8th dimension.
}

export const BASIS_SIZE = 8; // Updated to 8

// For debugging and visualization
export const MORPHISM_NAMES: Record<Morphism, string> = {
  [Morphism.I]: "I",
  [Morphism.Apply]: "@",
  [Morphism.Lambda]: "λ",
  [Morphism.And]: "∧",
  [Morphism.Not]: "¬",
  [Morphism.Cond]: "?",
  [Morphism.Pair]: "⊗",
  [Morphism.Void]: "_VOID_", // New void glyph name
};