// λ/lambda-7-tensor-processor/tensor.ts (Deepened T_3D rules for Σλ⁸)
import { Morphism, BASIS_SIZE, MORPHISM_NAMES } from "./basis.ts"; // Import updated BASIS_SIZE
import { Field } from "./runtime.ts"; // Assuming Field is exported from runtime

// Helper to create a field with a single dominant morphism
function createField(m: Morphism): Field {
    const field = new Float32Array(BASIS_SIZE);
    field[m] = 1.0;
    return field;
}

// Pre-defined fields for common states (ensure these are base fields, used as *sources* for copies)
const baseFieldEmpty = new Float32Array(BASIS_SIZE).fill(0); 
const baseFieldI = createField(Morphism.I); // Represents True
const baseFieldApply = createField(Morphism.Apply);
const baseFieldLambda = createField(Morphism.Lambda);
const baseFieldAnd = createField(Morphism.And);
const baseFieldNot = createField(Morphism.Not); // Represents False (or result of NOT)
const baseFieldCond = createField(Morphism.Cond);
const baseFieldPair = createField(Morphism.Pair);
const baseFieldVoid = createField(Morphism.Void); // New base field for Void


/**
 * The 3D tensor T[i][j][k] defines the resultant Field (vector in V)
 * when three morphisms interact.
 * T : M x M x M -> Field (or null if undefined for this combination).
 */
// Initialize with nulls, using the updated BASIS_SIZE
export const T_3D: (Field | null)[][][] = Array(BASIS_SIZE).fill(null).map(() =>
  Array(BASIS_SIZE).fill(null).map(() => Array(BASIS_SIZE).fill(null))
);

// --- 1. Define SPECIFIC semantic rules FIRST ---

// Logical Operations:
// Double Negation: ¬(¬X) -> X
T_3D[Morphism.Not][Morphism.Not][Morphism.I] = baseFieldI.slice();
T_3D[Morphism.Not][Morphism.Not][Morphism.Not] = baseFieldI.slice(); // Not(Not) -> I

// Not X: when NOT is operator, and X is operand in context C
T_3D[Morphism.I][Morphism.Not][Morphism.I] = baseFieldNot.slice(); // Not True -> False (Context I, Op Not, Operand I -> Not)
T_3D[Morphism.I][Morphism.Not][Morphism.Not] = baseFieldI.slice(); // Not False -> True (Context I, Op Not, Operand Not -> I)

// Full Truth Table for AND (∧) logic:
for (let i of [Morphism.I, Morphism.Not]) { // Context operand
  for (let k of [Morphism.I, Morphism.Not]) { // Operand operand
    if (i === Morphism.I && k === Morphism.I) { // True AND True
      T_3D[i][Morphism.And][k] = baseFieldI.slice();
    } else { // Other cases are False
      T_3D[i][Morphism.And][k] = baseFieldNot.slice();
    }
  }
}

// Functional Operations:
// Simplified Beta-reduction: (λx.x)(I) -> I (Context Lambda, Op I, Operand Apply -> I)
T_3D[Morphism.Lambda][Morphism.I][Morphism.Apply] = baseFieldI.slice();

// Pair (⊗) interactions:
// Specific high-priority rule (Context I, Op Pair, Operand I -> Pair)
T_3D[Morphism.I][Morphism.Pair][Morphism.I] = baseFieldPair.slice();

// Generic rule for forming a pair from two arbitrary elements.
// This will be overridden by the Identity rules later if one of them is I.
for (let i = 0; i < BASIS_SIZE; i++) {
  for (let k = 0; k < BASIS_SIZE; k++) {
    // Only set if not already specifically defined
    if (T_3D[i][Morphism.Pair][k] === null) {
        const pairInfluenceField = createField(Morphism.Pair);
        pairInfluenceField[i] += 0.5;
        pairInfluenceField[k] += 0.5;
        let sum = pairInfluenceField.reduce((acc, val) => acc + val, 0);
        if (sum > 0) {
            for (let idx = 0; idx < BASIS_SIZE; idx++) pairInfluenceField[idx] /= sum;
        } else {
            pairInfluenceField[Morphism.Pair] = 1.0;
        }
        T_3D[i][Morphism.Pair][k] = pairInfluenceField.slice();
    }
  }
}

// Conditional (?)
T_3D[Morphism.Cond][Morphism.I][Morphism.Lambda] = baseFieldLambda.slice(); // If True, Then Lambda
T_3D[Morphism.Cond][Morphism.Not][Morphism.Apply] = baseFieldApply.slice(); // If False, Then Apply


// --- Rules for Void (Morphism.Void) ---
// Void is the 8th morphism, represents NOP or potential.
// Interactions with Void often result in Void (absorbing) or act as NOP (passthrough).
for (let j = 0; j < BASIS_SIZE; j++) { // Operator
    for (let k = 0; k < BASIS_SIZE; k++) { // Operand
        // Rule: Void as Context (m1). Void.j.k -> k (passthrough if j is I, otherwise Void absorbs)
        T_3D[Morphism.Void][j][k] = (j === Morphism.I) ? createField(k).slice() : baseFieldVoid.slice();
    }
}
for (let i = 0; i < BASIS_SIZE; i++) { // Context
    for (let k = 0; k < BASIS_SIZE; k++) { // Operand
        // Rule: Void as Operator (m2). i.Void.k -> Void (Void absorbs operator)
        T_3D[i][Morphism.Void][k] = baseFieldVoid.slice();
    }
}
for (let i = 0; i < BASIS_SIZE; i++) { // Context
    for (let j = 0; j < BASIS_SIZE; j++) { // Operator
        // Rule: Void as Operand (k). i.j.Void -> Void (Void absorbs operand)
        T_3D[i][j][Morphism.Void] = baseFieldVoid.slice();
    }
}
// Specific rule: Void.Void.Void -> Void
T_3D[Morphism.Void][Morphism.Void][Morphism.Void] = baseFieldVoid.slice();


// --- 2. Fill in the rest with GENERIC Identity interactions ---
// This ensures that specific rules defined above are not overwritten.
for (let i = 0; i < BASIS_SIZE; i++) { // First morphism (context)
  for (let j = 0; j < BASIS_SIZE; j++) { // Second morphism (operator)
    for (let k = 0; k < BASIS_SIZE; k++) { // Third morphism (operand)
      // Only apply generic rules if no specific rule exists
      if (T_3D[i][j][k] === null) {
          if (i === Morphism.I) { // Rule 1: I.j.k -> k (I as context)
            T_3D[i][j][k] = createField(k as Morphism).slice();
          } else if (j === Morphism.I) { // Rule 2: i.I.k -> i (I as operator)
            T_3D[i][j][k] = createField(i as Morphism).slice();
          } else if (k === Morphism.I) { // Rule 3: i.j.I -> i (I as operand)
            T_3D[i][j][k] = createField(i as Morphism).slice();
          } else {
            // Default to Void absorption if no specific rule and no Identity rule applies
            T_3D[i][j][k] = baseFieldVoid.slice();
          }
      }
    }
  }
}

// Helper function (update for 3D)
export function printTensor(tensor: (Field | null)[][][]) {
  console.log("--- 3D Interaction Tensor T_3D ---");
  const names = Object.values(MORPHISM_NAMES).filter(v => typeof v === 'string') as string[]; // Get string names

  tensor.forEach((plane, i) => {
    console.log(`\nPlane ${names[i]} (first morphism):`);
    let header = "      ";
    for (const name of names) {
      header += `${name}`.padEnd(15); // Adjust padding for array output
    }
    console.log(header);
    console.log("    " + "—".repeat(BASIS_SIZE * 15));

    plane.forEach((row, j) => {
      let rowStr = `  ${names[j]} | `;
      row.forEach(val => {
        rowStr += `${val === null ? "." : `[${Array.from(val).map(v => v.toFixed(1)).join(',')}]`}`.padEnd(15);
      });
      console.log(rowStr);
    });
  });
}