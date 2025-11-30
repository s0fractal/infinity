// @file: ∘.ts
//
// This file defines the TypeScript projection for the ∘ glyph (Composition).
// It captures the essence of classical function composition, which is a fundamental
// tensor interaction within the λ⁷ Tensor Field for chaining computational operations.

import {
  ProgramInput,
  ProgramOutput,
  ComputableFunction,
} from "./λ_universal.ts";

// Import the concrete types from the ⭘ (Base Layer) definition.
import { Lambda7MorphismValue } from "./⭘.ts";

/**
 * Represents a single fundamental λ⁷ morphism (its executable value/function)
 * as defined in the ⭘ base layer.
 */
export type BaseLambda7Morphism = Lambda7MorphismValue;

/**
 * Represents a "derivation" – a sequence of `BaseLambda7Morphism`s that defines a computation.
 * This sequence, when processed by the λ⁷ Tensor Field Processor, results in a `ComputableFunction`.
 * Function composition (∘) is a key mechanism for constructing such derivations.
 */
export type Derivation = BaseLambda7Morphism[];

/**
 * Defines the type signature for the classical function composition operator (∘).
 * It takes two functions, `f` and `g`, and returns a new function that applies `g` first,
 * then applies `f` to the result of `g`.
 *
 * This `compose` function itself represents a fundamental interaction within the
 * λ⁷ Tensor Field, allowing for the construction of complex derivations from simpler ones.
 *
 * @template A The input type for the `g` function (and the composed function).
 * @template B The output type for the `g` function and input type for the `f` function.
 * @template C The output type for the `f` function (and the composed function).
 * @param f The second function to apply (`B => C`).
 * @param g The first function to apply (`A => B`).
 * @returns A new function (`A => C`) representing `f(g(x))`.
 */
export type ComposeFunction = <A, B, C>(
  f: ComputableFunction<B, C>,
  g: ComputableFunction<A, B>
) => ComputableFunction<A, C>;

// Example implementation (conceptual, demonstrates the type)
/*
const compose: ComposeFunction = (f, g) => (x) => f(g(x));

// Assuming example ComputableFunctions for base morphisms exist:
const double: ComputableFunction<number, number> = (x) => x * 2;
const increment: ComputableFunction<number, number> = (x) => x + 1;

// Usage:
const doubleThenIncrement = compose(increment, double);
const incrementThenDouble = compose(double, increment);

console.log("Double then Increment (5):", doubleThenIncrement(5)); // (5 * 2) + 1 = 11
console.log("Increment then Double (5):", incrementThenDouble(5)); // (5 + 1) * 2 = 12

// This 'compose' function itself can be seen as a higher-order operation
// that helps construct larger 'derivations' (programs) for the λ⁷ processor.
// For instance, the derivation for 'incrementThenDouble' might be something like:
// [INCREMENT_Morphism, COMPOSE_Morphism, DOUBLE_Morphism] if COMPOSE_Morphism existed
// or more fundamentally, built from λ, @, I.
*/

// Note: The actual `λ7TensorFieldProcessor` interface, evaluation logic, and
// definition of the `interactionTensor` would reside in a more central file
// (e.g., `λ_universal.ts` or a dedicated `processor.ts`) as per the
// `@L7Tensor.md` description of the λ⁷-CPU.
