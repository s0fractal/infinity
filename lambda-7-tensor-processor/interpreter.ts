// λ/lambda-7-tensor-processor/interpreter.ts (Improved interpretSignature)
import { BASIS_SIZE, Morphism } from "./basis.ts";
import { Field, Derivation } from "./runtime.ts";
import { compileDslToDerivation, DslExpression } from "./dsl_compiler.ts";

// --- 1. Define Σ-constructs interfaces ---

// From README.md: 2.1 Signature as an Ordered Structure
// type τ_i ∈ { String, Blob } ∪ Σ
export type FieldType = "String" | "Blob" | Signature; 

export interface FieldDefinition {
  key: string;
  type: FieldType;
}

export interface Signature {
  name: string;
  fields: FieldDefinition[]; // F = { k_i : τ_i }
}

// From README.md: 2.2 Rule as a Transformation
export interface Rule {
  name: string;
  inSignatures: Signature[]; // vec_sigma_in
  outSignatures: Signature[]; // vec_sigma_out
  transform: DslExpression; // Phi - an expression in our minimal DSL
}

// --- 2. Interpretation Function llbracket . rrrbracket ---

// Helper to generate a stable hash for a string (simple additive hash)
function simpleHash(s: string): number {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
        hash = (hash << 5) - hash + s.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Implements llbracket Signature rrrbracket = v_σ ∈ V.
 * Maps a Signature to a unique 7D vector (Field).
 * This mapping aims for a more structured and deterministic approach than a simple hash.
 * @param signature The Signature object.
 * @returns A 7D Field representing the Signature.
 */
export function interpretSignature(signature: Signature): Field {
  const field = new Float32Array(BASIS_SIZE).fill(0);

  // Influence from Signature name
  const nameHash = simpleHash(signature.name);
  field[Morphism.I] += (nameHash % 100) / 1000;
  field[Morphism.Apply] += (nameHash % 70) / 1000;

  // Influence from fields
  signature.fields.forEach((fd, index) => {
    const keyHash = simpleHash(fd.key);
    field[Morphism.Lambda] += (keyHash % 50) / 1000;
    
    // Type influence (recursive for nested Signatures)
    if (typeof fd.type === "string") {
      const typeHash = simpleHash(fd.type);
      field[Morphism.And] += (typeHash % 40) / 1000;
    } else { // Nested Signature
      const nestedField = interpretSignature(fd.type);
      for (let i = 0; i < BASIS_SIZE; i++) {
        field[i] += nestedField[i] * 0.1; // Add scaled influence from nested signature
      }
    }
    field[Morphism.Not] += (index % 7) / 1000; // Position of the field influences
  });

  // Ensure field has some presence, if all calculations resulted in zero
  if (field.every(v => v === 0)) {
    field[Morphism.I] = 0.1; 
  }

  // Normalize field so sum of weights is 1 (representing a probability distribution or normalized vector)
  let sum = field.reduce((acc, val) => acc + val, 0);
  if (sum > 0) {
    for (let i = 0; i < BASIS_SIZE; i++) {
      field[i] /= sum;
    }
  } else {
      field[Morphism.I] = 1.0; // If sum is zero, default to pure Identity
  }

  return field;
}

/**
 * Implements llbracket Rule rrrbracket = R_ρ ∈ End(V).
 * Maps a Rule to an Operator (which is a Derivation, essentially).
 * @param rule The Rule object.
 * @returns A Derivation representing the Rule's transformation.
 */
export function interpretRule(rule: Rule): Derivation {
  // A Rule's transformation (Phi) is a DSL expression.
  // We compile this DSL expression into a Derivation.
  return compileDslToDerivation(rule.transform);
}

// Example Usage (for testing)
if (import.meta.main) {
  // Example Signature
  const fileSignature: Signature = {
    name: "File",
    fields: [
      { key: "path", type: "String" },
      { key: "content", type: "Blob" },
    ],
  };

  const dirSignature: Signature = {
      name: "Directory",
      fields: [
          { key: "path", type: "String" },
          { key: "files", type: fileSignature }, // Nested signature
      ]
  };

  console.log("Interpreting Signature 'File'...");
  const fileVector = interpretSignature(fileSignature);
  console.log("Resultant Field (Vector for File):", Array.from(fileVector).map(v => v.toFixed(3)));

  console.log("\nInterpreting Signature 'Directory' (with nested File)...");
  const dirVector = interpretSignature(dirSignature);
  console.log("Resultant Field (Vector for Directory):", Array.from(dirVector).map(v => v.toFixed(3)));


  // Example Rule: Normalize Path
  const normalizeRule: Rule = {
    name: "NormalizePath",
    inSignatures: [fileSignature],
    outSignatures: [fileSignature], // Assuming it returns a normalized File
    transform: {
      type: "NORMALIZE",
      e: { type: "ACCESS", target: { type: "LIT", value: "input.path" }, key: "path" }, // Simplified access DSL
    },
  };

  console.log("\nInterpreting Rule 'NormalizePath'...");
  const normalizeDerivation = interpretRule(normalizeRule);
  console.log("Resultant Derivation (from Rule):", normalizeDerivation.map(m => Morphism[m]));
}