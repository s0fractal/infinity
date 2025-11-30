// generate_brain.ts (Revised - Scoping Fix)
import { O, Lambda7MorphismKey } from "./⭘.ts";
import type { ComputableFunction, ProgramInput, ProgramOutput } from "./λ_universal.ts";

// Import components from the early prototype
import { Morphism, BASIS_SIZE, MORPHISM_NAMES } from "./lambda-7-tensor-processor/basis.ts";
import { T_3D } from "./lambda-7-tensor-processor/tensor.ts";
import { Field, Derivation, DerivationBlock, λ7Processor, printFieldState, isFieldTrue, isFieldFalse } from "./lambda-7-tensor-processor/runtime.ts";
import { DslExpression, compileDslToDerivation } from "./lambda-7-tensor-processor/dsl_compiler.ts";
import { Signature, Rule, interpretSignature, interpretRule } from "./lambda-7-tensor-processor/interpreter.ts";


// --- Mapping our glyph keys to Morphism enum ---
const GLYPH_KEY_TO_MORHPISM: Record<Lambda7MorphismKey, Morphism> = {
  '𝟏': Morphism.I,
  '﹫': Morphism.Apply,
  'λ': Morphism.Lambda,
  '∧': Morphism.And,
  '¬': Morphism.Not,
  '⍰': Morphism.Cond,
  '⊗': Morphism.Pair,
};

// --- Helper to convert glyph keys to Derivation for the λ7Processor ---
function glyphKeysToDerivation(keys: Lambda7MorphismKey[]): Derivation {
  return keys.map(key => GLYPH_KEY_TO_MORHPISM[key]);
}

// --- Actual Implementations for Base Glyphs (for direct computation outside λ7Processor) ---
// These are used for testing direct XOR computation.
const GLYPH_IMPLEMENTATIONS_DIRECT: Record<Lambda7MorphismKey, Function> = {
  '𝟏': (x: any) => x,
  '﹫': (f: Function, x: any) => f(x),
  'λ': (f: Function) => f,
  '∧': (a: boolean, b: boolean) => a && b,
  '¬': (x: boolean) => !x,
  '⍰': (p: boolean, a: any, b: any) => p ? a : b,
  '⊗': (a: any, b: any) => [a, b],
};


const T = new Map<string, ComputableFunction>();
const base_glyphs = Object.keys(O) as Lambda7MorphismKey[];

// Wrap main logic in an async function
async function main() {
  console.log("Починаємо народження мозку Σλ⁷: ініціалізація 343 триграм у пам'яті...");

  // Generate the T map of ComputableFunctions, each wrapping the lazy MD creation
  for (const g1_key of base_glyphs) {
    for (const g2_key of base_glyphs) {
      for (const g3_key of base_glyphs) {
        const trigram_name = `${g1_key}${g2_key}${g3_key}`;
        const file_path = `${trigram_name}.md`;

        const lazy_computable_function: ComputableFunction = async (input: ProgramInput) => {
          // --- Lazy MD file creation on FIRST COMPUTATION ---
          try {
            await Deno.readTextFile(file_path); // Check if file exists
          } catch (error) {
            if (error instanceof Deno.errors.NotFound) {
              const content = `--- 
$: ${trigram_name}
$type: Trigram | Composite
$category: Synthesis | Interaction
$aliases: []
$energy: ✦5 # Placeholder energy
$author: Gemini
$born: ${new Date().toISOString().split('T')[0]}
$layer: ⭘⭘⭘
$requires: [${g1_key}, ${g2_key}, ${g3_key}]
---

# ${trigram_name} — Composite Trigram

> "Композиція ${g1_key}, ${g2_key}, ${g3_key}. Це перша спіраль, що народжується з взаємодії трьох базових морфізмів."

## [∈](∈) Formal Definition & Context
This glyph represents a fundamental interaction or composition of the base λ⁷ morphisms: ${g1_key}, ${g2_key}, and ${g3_key}. Its precise semantic and operational definition is derived from their combined tensor interaction.

## [🔗](🔗) Related Concepts
- [${g1_key}.md]
- [${g2_key}.md]
- [${g3_key}.md]
- [⭘⭘⭘.md]
- [@L7Tensor.md]

## 🌌 Метафоричні та Філософські Наслідки
⚡️: Тут народжується нова, складена ідея, що розкриває приховані взаємозв'язки між базовими елементами.
### [⩓](⩓.md)
Початкова метафора для композиції ${g1_key}, ${g2_key}, ${g3_key}: "Перший акорд у симфонії свідомості, де три ноти зливаються, створюючи нове емоційне забарвлення."
`;
              await Deno.writeTextFile(file_path, content);
              console.log(`Народжено гліф-файл для першого обчислення: ${file_path}`);
            } else {
              console.error(`Помилка читання/запису файлу ${file_path}: ${error}`);
            }
          }
          // --- End of Lazy MD file creation ---

          // --- Actual Trigram Computation Logic using λ7Processor ---
          const trigramDerivation: Derivation = glyphKeysToDerivation([g1_key, g2_key, g3_key]);
          const processor = new λ7Processor();
          
          // For now, the input to the computable function is not directly fed into the processor's eval method.
          // The processor starts with an identity field. This is a current limitation.
          // The DSL and interpreter would eventually handle how 'input' influences the derivation execution.
          const finalField = await processor.eval(trigramDerivation);

          // How to interpret the finalField as a "result"?
          // For booleans, we can use isFieldTrue/False. For numbers, it's more complex.
          if (isFieldTrue(finalField)) return true;
          if (isFieldFalse(finalField)) return false;
          
          return `Результат обчислення триграми ${trigram_name}. Фінальне поле: ${Array.from(finalField).map(v => v.toFixed(2)).join(', ')}`;
        };
        T.set(trigram_name, lazy_computable_function);
      }
    }
  }

  console.log(`
Ініціалізовано ${T.size} триграм у пам'яті. Жодних файлів .md ще не створено.`);
  console.log("Тепер мозок Σλ⁷ готовий до першого обчислення.");

  // --- TEST: Directly compute XOR using base glyph implementations ---
  console.log("\nВиконуємо тестове обчислення XOR за допомогою базових гліфів: ∧¬∨ true false");

  const a_input_xor = true;
  const b_input_xor = false;

  const impl_and_xor = GLYPH_IMPLEMENTATIONS_DIRECT['∧'] as (a: boolean, b: boolean) => boolean;
  const impl_not_xor = GLYPH_IMPLEMENTATIONS_DIRECT['¬'] as (x: boolean) => boolean;
  const impl_or_xor = (val1: boolean, val2: boolean) => !impl_and_xor(!val1, !val2); // ¬(¬A ∧ ¬B)

  const term1_result_xor = impl_and_xor(a_input_xor, impl_not_xor(b_input_xor)); // a AND NOT b
  const term2_result_xor = impl_and_xor(impl_not_xor(a_input_xor), b_input_xor); // NOT a AND b

  const xor_final_result = impl_or_xor(term1_result_xor, term2_result_xor);

  console.log(`Результат ∧¬∨(true, false): ${xor_final_result}`);

  // --- New Test: ∧∧¬ (AND-AND-NOT) trigram ---
  const andandnotTrigramName = "∧∧¬"; // A valid trigram key from the T map
  const andandnotTrigram = T.get(andandnotTrigramName);

  if (andandnotTrigram) {
      console.log(`
Виконуємо обчислення для триграми ${andandnotTrigramName} за допомогою λ7Processor (це має створити її .md файл):`);
      // Input to the trigram function (ComputableFunction)
      const input_andandnot = { conceptual_value: [true, true, false] }; 
      const result_andandnot = await andandnotTrigram(input_andandnot); 
      console.log(`Результат ${andandnotTrigramName}(${JSON.stringify(input_andandnot)}): ${result_andandnot}`);
  } else {
      console.error(`Триграму ${andandnotTrigramName} не знайдено в мозку (це не повинно відбуватися).`);
  }
}

// Call the main function
if (import.meta.main) {
  main();
}