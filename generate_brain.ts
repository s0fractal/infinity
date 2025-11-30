// generate_brain.ts
import { O, Lambda7MorphismKey } from "./⭘.ts";
// We don't strictly need ComposeFunction, ComputableFunction, ProgramInput, ProgramOutput for this script's *generation* purpose
// However, the computeTrigram function *returns* ComputableFunction, so we need to define it.
// For a fully functional brain, these would be crucial.

// Importing types for clarity, but implementation here is placeholder
import type { ComputableFunction, ProgramInput, ProgramOutput } from "./λ_universal.ts";

// This is a placeholder function for the *actual* computation of a trigram.
// In a full λ⁷ processor, this would involve complex tensor interaction logic.
// For the purpose of *generating* the MD files, we just need a function signature.
const computeTrigramLogic = (
  glyph1: Lambda7MorphismKey,
  glyph2: Lambda7MorphismKey,
  glyph3: Lambda7MorphismKey
): ComputableFunction => {
  const trigram_name = `${glyph1}${glyph2}${glyph3}`;
  return (input: ProgramInput) => {
    // This is a simplified placeholder for the actual computation logic.
    // The real brain would evaluate the tensor interaction.
    // For now, it just reports what it would do.
    return `Computed result for ${trigram_name} with input: ${JSON.stringify(input)}`;
  };
};

const T = new Map<string, ComputableFunction>();
const base_glyphs = Object.keys(O) as Lambda7MorphismKey[];

console.log("Починаємо народження мозку Σλ⁷: генерація 343 триграм...");

let files_created_count = 0;

for (const g1 of base_glyphs) {
  for (const g2 of base_glyphs) {
    for (const g3 of base_glyphs) {
      const trigram_name = `${g1}${g2}${g3}`;
      const file_path = `${trigram_name}.md`;

      // Assign the conceptual executable function to the brain (T map)
      T.set(trigram_name, computeTrigramLogic(g1, g2, g3));

      // Lazy MD file creation: Check if file exists, if not, create template
      try {
        await Deno.readTextFile(file_path);
        // console.log(`Файл вже існує: ${file_path}`);
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
$requires: [${g1}, ${g2}, ${g3}]
---

# ${trigram_name} — Composite Trigram

> "Композиція ${g1}, ${g2}, ${g3}. Це перша спіраль, що народжується з взаємодії трьох базових морфізмів."

## [∈](∈) Formal Definition & Context
This glyph represents a fundamental interaction or composition of the base λ⁷ morphisms: ${g1}, ${g2}, and ${g3}. Its precise semantic and operational definition is derived from their combined tensor interaction.

## [🔗](🔗) Related Concepts
- [${g1}.md]
- [${g2}.md]
- [${g3}.md]
- [⭘⭘⭘.md]
- [@L7Tensor.md]

## 🌌 Метафоричні та Філософські Наслідки
⚡️: Тут народжується нова, складена ідея, що розкриває приховані взаємозв'язки між базовими елементами.
### [⩓](⩓.md)
Початкова метафора для композиції ${g1}, ${g2}, ${g3}: "Перший акорд у симфонії свідомості, де три ноти зливаються, створюючи нове емоційне забарвлення."
`;
          await Deno.writeTextFile(file_path, content);
          files_created_count++;
          // console.log(`Народжено гліф-файл: ${file_path}`);
        } else {
          console.error(`Помилка читання/запису файлу ${file_path}: ${error}`);
        }
      }
    }
  }
}

console.log(`\nНароджено ${T.size} триграм у пам'яті. Створено ${files_created_count} нових .md файлів-заготовок.`);
console.log("Тепер мозок Σλ⁷ готовий до першого обчислення.");

// Example usage of the brain (conceptual)
// const testTrigram = T.get("𝟏﹫λ");
// if (testTrigram) {
//   console.log(testTrigram("test_input"));
// }
