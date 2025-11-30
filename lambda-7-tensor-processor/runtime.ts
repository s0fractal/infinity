// λ/lambda-7-tensor-processor/runtime.ts (Re-introducing DerivationBlock for structured derivations)
import { Morphism, BASIS_SIZE, MORPHISM_NAMES } from "./basis.ts";
import { T_3D } from "./tensor.ts"; 

// The state of the computational field as a 7D vector.
export type Field = Float32Array;

/**
 * Interface for a Derivation block (a nested derivation).
 */
export interface DerivationBlock {
  type: "BLOCK";
  morphisms: Derivation; // A nested derivation
}

/**
 * A primitive can be a Morphism or a DerivationBlock.
 */
export type Primitive = Morphism | DerivationBlock; 

/**
 * A derivation is a sequence of primitives.
 */
export type Derivation = Primitive[]; 


/**
 * Helper function to print a Field in a more human-readable format.
 * Shows dominant morphisms and their weights.
 */
export function printFieldState(field: Field, prefix: string = "  Field"): void {
  const activeMorphisms: string[] = [];
  let totalWeight = 0;
  for (let i = 0; i < BASIS_SIZE; i++) {
    if (field[i] > 0) {
      activeMorphisms.push(`${MORPHISM_NAMES[i as Morphism]}: ${field[i].toFixed(3)}`);
      totalWeight += field[i];
    }
  }
  if (totalWeight === 0) {
      console.log(`${prefix}: [Empty]`);
  } else {
      console.log(`${prefix}: { ${activeMorphisms.join(', ')} } (Total: ${totalWeight.toFixed(3)})`);
  }
}

/**
 * Determines if the given Field represents a 'true' condition.
 * For now, 'true' if Morphism.I is dominant.
 */
export function isFieldTrue(field: Field): boolean { // Exported for CoreReflexLoop
    const maxVal = Math.max(...field);
    return field[Morphism.I] === maxVal && maxVal > 0;
}

/**
 * Determines if the given Field represents a 'false' condition.
 * For now, 'false' if Morphism.Not is dominant.
 */
export function isFieldFalse(field: Field): boolean { // Exported for CoreReflexLoop
    const maxVal = Math.max(...field);
    return field[Morphism.Not] === maxVal && maxVal > 0;
}


export class λ7Processor {
  public field: Field;
  private eval_steps = 0;
  
  // To provide context for 3D tensor, we keep a history of the last two applied morphisms.
  // history[0] is m1 (previous-previous), history[1] is m2 (previous)
  private history: Morphism[] = [Morphism.I, Morphism.I]; 

  constructor() {
    this.field = new Float32Array(BASIS_SIZE);
    // Initialize field to represent a "pure Identity" state
    this.field[Morphism.I] = 1.0; 
  }

  /**
   * Applies the tensor interaction to the current field based on an incoming morphism.
   * This updates the field according to T_3D rules.
   * @param incomingMorphism The morphism currently being processed from the derivation.
   */
  private applyTensor(incomingMorphism: Morphism): void {
    // Extract two context morphisms from history for the 3D tensor lookup
    // m1 = context / previous-previous, m2 = operator / previous
    const m1 = this.history[0]; 
    const m2 = this.history[1]; 

    console.log(`  Applying T_3D[${MORPHISM_NAMES[m1]}][${MORPHISM_NAMES[m2]}][${MORPHISM_NAMES[incomingMorphism]}]...`);

    const resultantField: Field | null = T_3D[m1][m2][incomingMorphism]; // Interpret T_3D output as a 'resultant state' Field

    if (resultantField !== null) {
      // If a specific rule is found, the field is directly transformed to the resultantField.
      this.field = resultantField.slice(); // Use slice() to create a new Field instance, ensuring no shared reference
      printFieldState(this.field, "    Resultant Field (Direct Assignment)");
    } else {
      // If no specific rule, increment the weight of the incoming morphism in the current field.
      this.field[incomingMorphism]++;
      // Normalize after increment
      let sum = this.field.reduce((acc, val) => acc + val, 0);
      if (sum === 0) { // Avoid division by zero, default to Identity if field collapses
          this.field.fill(0);
          this.field[Morphism.I] = 1.0;
          sum = 1.0;
      }
      for (let i = 0; i < BASIS_SIZE; i++) {
          this.field[i] /= sum;
      }
      printFieldState(this.field, `    No specific T_3D rule, incrementing ${MORPHISM_NAMES[incomingMorphism]} in field`);
    }

    // Update history for the next tensor application
    this.history[0] = this.history[1]; // Shift m2 to m1 position
    this.history[1] = incomingMorphism; // Set incoming as new m2
  }

  /**
   * Evaluates a derivation sequence by transforming the computational field.
   * @param derivation The sequence of primitives to evaluate.
   * @returns The final state of the computational field.
   */
  async eval(derivation: Derivation): Promise<Field> {
    console.log(`[Processor] Evaluating derivation...`);
    printFieldState(this.field, "[Processor] Initial Field");
    console.log(`[Processor] Initial History: [${this.history.map(m => MORPHISM_NAMES[m]).join(', ')}]`);

    for (const currentPrimitive of derivation) { 
      this.eval_steps++;

      if (typeof currentPrimitive === 'number') { // It's a Morphism
        console.log(`[Processor] Step ${this.eval_steps}: Processing Morphism: ${MORPHISM_NAMES[currentPrimitive]}`);
        // Apply the tensor for each morphism.
        this.applyTensor(currentPrimitive);
      } else if (currentPrimitive.type === "BLOCK") { // It's a DerivationBlock
        // If a block is encountered without a Cond, it should be processed sequentially.
        console.log(`[Processor] Step ${this.eval_steps}: Processing DerivationBlock.`);
        await this.eval(currentPrimitive.morphisms); // Recursively evaluate the block
      } else {
        throw new Error(`Unknown primitive type in derivation at eval_step=${this.eval_steps}.`);
      }
    }
    
    console.log(`[Processor] Evaluation finished in ${this.eval_steps} steps.`);
    return this.field;
  }
}

// Example usage (for testing)
if (import.meta.main) {
    // Example Derivation: (λx.x)(I) -> I (original test)
    const originalDerivation: Derivation = [
        Morphism.Lambda,
        Morphism.I,
        Morphism.Apply
    ];

    const processorOriginal = new λ7Processor();
    processorOriginal.eval(originalDerivation)
        .then(finalField => {
            console.log("\n--- Original Test Evaluation Result ---");
            printFieldState(finalField, "Final Field");
            const dominantMorphism = finalField.indexOf(Math.max(...finalField));
            console.log("Dominant Morphism:", MORPHISM_NAMES[dominantMorphism as Morphism]);
        })
        .catch(error => console.error("Processor error:", error));
}
