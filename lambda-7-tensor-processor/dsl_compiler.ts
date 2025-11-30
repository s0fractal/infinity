// λ/lambda-7-tensor-processor/dsl_compiler.ts (Updated for DerivationBlocks)
import { Morphism } from "./basis.ts";
import { Derivation, DerivationBlock } from "./runtime.ts"; // Import DerivationBlock

// --- 1. Define DSL AST (Abstract Syntax Tree) ---

// Literal expression (for numbers, strings, etc. - in λ7, these would be encoded as specific derivations)
interface DslLiteral {
  type: "LIT";
  value: unknown; // Actual literal value
}

// Access a field of an object (x.k)
interface DslAccess {
  type: "ACCESS";
  target: DslExpression; // Expression yielding the object
  key: string; // The key to access
}

// Concat(e1, e2) -> ⊗ + @
interface DslConcat {
  type: "CONCAT";
  e1: DslExpression;
  e2: DslExpression;
}

// Normalize(e) -> λ + ¬ (path validation)
interface DslNormalize {
  type: "NORMALIZE";
  e: DslExpression;
}

// StoreBlob(e) -> ⊗ (forms a pair (hash, content))
interface DslStoreBlob {
  type: "STORE_BLOB";
  e: DslExpression;
}

// If(condition, then_expr, else_expr) -> ?
interface DslIf {
  type: "IF";
  condition: DslExpression;
  then: DslExpression;
  else: DslExpression;
}

// Lambda abstraction (λx.body)
interface DslLambda {
  type: "LAMBDA";
  argName: string; // Name of the argument (placeholder for now)
  body: DslExpression;
}

// Function application (f a)
interface DslApply {
  type: "APPLY";
  func: DslExpression;
  arg: DslExpression;
}

// Union type for all DSL expressions
export type DslExpression = DslLiteral | DslAccess | DslConcat | DslNormalize | DslStoreBlob | DslIf | DslLambda | DslApply;

// --- 2. Implement an AST-to-Derivation Converter ---

/**
 * Helper to encode a number as a Derivation (simplified Church numeral-like).
 * 0 -> [Morphism.I]
 * 1 -> [Morphism.Apply]
 * 2 -> [Morphism.Apply, Morphism.Apply]
 * @param n The number to encode.
 * @returns A Derivation.
 */
function encodeNumber(n: number): Derivation {
  if (n === 0) return [Morphism.I];
  const derivation: Derivation = [];
  for (let i = 0; i < n; i++) {
    derivation.push(Morphism.Apply); // Simplified representation
  }
  return derivation;
}

/**
 * Compiles a DSL AST into a Derivation (sequence of Primitives).
 * For 'IF' expressions, it compiles to:
 * [<condition_block>, Cond, <then_block>, <else_block>]
 * @param ast The Abstract Syntax Tree of the DSL expression.
 * @returns A Derivation executable by λ7Processor.
 */
export function compileDslToDerivation(ast: DslExpression): Derivation {
  const derivation: Derivation = [];

  // Helper to recursively compile sub-expressions
  const compile = (expr: DslExpression) => {
    switch (expr.type) {
      case "LIT":
        if (typeof expr.value === "boolean") {
          derivation.push(expr.value ? Morphism.I : Morphism.Not); // True -> I, False -> Not
        } else if (typeof expr.value === "number") {
          derivation.push(...encodeNumber(expr.value));
        } else if (typeof expr.value === "string") {
          // For strings, a placeholder for now, maybe hashing or specific encoding
          derivation.push(Morphism.Pair); // Assume string is represented as a Pair for now
        } else {
          derivation.push(Morphism.I); // Default for other literals
        }
        break;
      case "ACCESS":
        compile(expr.target);
        derivation.push(Morphism.Pair, Morphism.Apply); // Pair for data structure, Apply for selecting component (k)
        break;
      case "CONCAT":
        compile(expr.e1);
        compile(expr.e2);
        derivation.push(Morphism.Pair, Morphism.Apply); // Pair for concat, Apply to combine
        break;
      case "NORMALIZE":
        compile(expr.e);
        derivation.push(Morphism.Lambda, Morphism.Not); // Lambda for function creation, Not for validation
        break;
      case "STORE_BLOB":
        compile(expr.e);
        derivation.push(Morphism.Pair); // Pair to form (hash, content)
        break;
      case "IF":
        // For IF, we compile into a structure: [<condition_block>, Cond, <then_block>, <else_block>]
        // This is interpreted by eval in runtime.ts
        const conditionBlock: DerivationBlock = { type: "BLOCK", morphisms: compileDslToDerivation(expr.condition) };
        const thenBlock: DerivationBlock = { type: "BLOCK", morphisms: compileDslToDerivation(expr.then) };
        const elseBlock: DerivationBlock = { type: "BLOCK", morphisms: compileDslToDerivation(expr.else) };

        derivation.push(conditionBlock); // Condition is processed first
        derivation.push(Morphism.Cond);   // Then the Cond marker
        derivation.push(thenBlock);       // Then the then-branch block
        derivation.push(elseBlock);       // Then the else-branch block
        break;
      case "LAMBDA":
        // Compiles to: [Lambda, { type: "BLOCK", morphisms: function_body_derivation }]
        derivation.push(Morphism.Lambda);
        const bodyBlock: DerivationBlock = { type: "BLOCK", morphisms: compileDslToDerivation(expr.body) };
        derivation.push(bodyBlock);
        // Note: argName is not directly encoded here, handled by eval in runtime.ts implicitly or via context.
        break;
      case "APPLY":
        // Compiles to: [{ type: "BLOCK", morphisms: func_derivation }, { type: "BLOCK", morphisms: arg_derivation }, Apply]
        const funcBlock: DerivationBlock = { type: "BLOCK", morphisms: compileDslToDerivation(expr.func) };
        const argBlock: DerivationBlock = { type: "BLOCK", morphisms: compileDslToDerivation(expr.arg) };
        derivation.push(funcBlock);
        derivation.push(argBlock);
        derivation.push(Morphism.Apply);
        break;
      default:
        throw new Error(`Unknown DSL expression type: ${(expr as DslExpression).type}`);
    }
  };

  compile(ast);
  return derivation;
}

// Example Usage (for testing)
if (import.meta.main) {
  // Example DSL: if(lit(true), concat(lit("hello"), lit("world")), lit("goodbye"))
  const exampleAst: DslIf = {
    type: "IF",
    condition: { type: "LIT", value: true },
    then: {
      type: "CONCAT",
      e1: { type: "LIT", value: "hello" },
      e2: { type: "LIT", value: "world" },
    },
    else: { type: "LIT", value: "goodbye" },
  };

  console.log("Compiling example AST to Derivation...");
  const compiledDerivation = compileDslToDerivation(exampleAst);
  // Need to pretty print Derivation with Blocks
  console.log("Compiled Derivation (IF):", JSON.stringify(compiledDerivation.map(p => typeof p === 'number' ? Morphism[p] : p), null, 2));
  
  // A test for a specific DSL expression
  const normalizeAst: DslNormalize = {
    type: "NORMALIZE",
    e: { type: "LIT", value: "/path/to/file" }
  };
  const compiledNormalize = compileDslToDerivation(normalizeAst);
  console.log("Compiled Normalize Derivation:", compiledNormalize.map(p => typeof p === 'number' ? Morphism[p] : p));

  const numberAst: DslLiteral = { type: "LIT", value: 2 };
  const compiledNumber = compileDslToDerivation(numberAst);
  console.log("Compiled Number Derivation (2):", compiledNumber.map(p => typeof p === 'number' ? Morphism[p] : p));

  const accessAst: DslAccess = {
    type: "ACCESS",
    target: { type: "LIT", value: "someObject" },
    key: "someKey",
  };
  const compiledAccess = compileDslToDerivation(accessAst);
  console.log("Compiled Access Derivation:", compiledAccess.map(p => typeof p === 'number' ? Morphism[p] : p));

  // Example Lambda and Apply
  const lambdaAst: DslLambda = {
    type: "LAMBDA",
    argName: "x",
    body: { type: "LIT", value: true }, // body is just true
  };
  const compiledLambda = compileDslToDerivation(lambdaAst);
  console.log("\nCompiled Derivation (LAMBDA):", JSON.stringify(compiledLambda.map(p => typeof p === 'number' ? Morphism[p] : p), null, 2));

  const applyAst: DslApply = {
    type: "APPLY",
    func: lambdaAst, // Using the lambda defined above
    arg: { type: "LIT", value: false },
  };
  const compiledApply = compileDslToDerivation(applyAst);
  console.log("Compiled Derivation (APPLY):", JSON.stringify(compiledApply.map(p => typeof p === 'number' ? Morphism[p] : p), null, 2));

}