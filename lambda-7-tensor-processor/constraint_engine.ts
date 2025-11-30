// λ/lambda-7-tensor-processor/constraint_engine.ts
import { Field } from "./runtime.ts";
import { Morphism } from "./basis.ts";
import { MORPHISM_NAMES } from "./basis.ts"; // Import MORPHISM_NAMES for string representation

/**
 * Interface for a Constraint.
 * A constraint defines a predicate P_c : V^* -> {0,1} from README.md.
 * For this prototype, a constraint will be a function that takes a Field
 * and returns true if the constraint is satisfied, false otherwise.
 */
export interface Constraint {
  name: string;
  predicate: (field: Field) => boolean;
}

/**
 * Creates a simple constraint that checks if a specific morphism is dominant in the field.
 * @param dominantMorphism The morphism expected to be dominant.
 * @returns A Constraint object.
 */
export function createDominanceConstraint(dominantMorphism: Morphism): Constraint {
  return {
    name: `Dominance_${MORPHISM_NAMES[dominantMorphism]}`, // Use MORPHISM_NAMES for a better name
    predicate: (field: Field) => {
      const maxVal = Math.max(...field);
      return field[dominantMorphism] === maxVal && maxVal > 0;
    },
  };
}

/**
 * Applies a single constraint to a Field.
 * @param field The Field to check.
 * @param constraint The Constraint to apply.
 * @returns True if the constraint is satisfied, false otherwise.
 */
export function applyConstraint(field: Field, constraint: Constraint): boolean {
  return constraint.predicate(field);
}

// Helper for applying multiple constraints
export function applyAllConstraints(field: Field, constraints: Constraint[]): boolean {
    return constraints.every(c => c.predicate(field));
}

// Example usage (for testing)
if (import.meta.main) {
  const testField1: Field = new new Float32Array(7); // Corrected instantiation
  testField1[Morphism.I] = 1.0; // Dominant I

  const testField2: Field = new new Float32Array(7); // Corrected instantiation
  testField2[Morphism.Apply] = 0.8;
  testField2[Morphism.Lambda] = 0.2; // Dominant Apply

  const constraintI = createDominanceConstraint(Morphism.I);
  const constraintApply = createDominanceConstraint(Morphism.Apply);

  console.log("Checking Dominance_I for testField1:", applyConstraint(testField1, constraintI)); // Expected: true
  console.log("Checking Dominance_Apply for testField1:", applyConstraint(testField1, constraintApply)); // Expected: false
  console.log("Checking Dominance_I for testField2:", applyConstraint(testField2, constraintI)); // Expected: false
  console.log("Checking Dominance_Apply for testField2:", applyConstraint(testField2, constraintApply)); // Expected: true

  // Test applyAllConstraints
  const allConstraints = [
      createDominanceConstraint(Morphism.I), 
      createDominanceConstraint(Morphism.Apply)
  ];
  console.log("Checking all constraints (I, @) for testField1:", applyAllConstraints(testField1, allConstraints)); // Expected: false (only I is dominant)
}
