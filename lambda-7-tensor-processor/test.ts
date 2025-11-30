// λ/lambda-7-tensor-processor/test.ts
import { Morphism, MORPHISM_NAMES, BASIS_SIZE } from "./basis.ts";
import { T_3D } from "./tensor.ts";
import { λ7Processor, Derivation, Field } from "./runtime.ts";
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

// Helper to create a field with a single dominant morphism
function createField(m: Morphism): Field {
    const field = new Float32Array(BASIS_SIZE);
    field[m] = 1.0;
    return field;
}

// Helper to check if two fields are approximately equal
function fieldsAreEqual(f1: Field, f2: Field, tolerance: number = 0.0001): boolean {
    if (f1.length !== f2.length) return false;
    for (let i = 0; i < f1.length; i++) {
        if (Math.abs(f1[i] - f2[i]) > tolerance) return false;
    }
    return true;
}

Deno.test("λ7Processor: Initial state is pure Identity", () => {
    const processor = new λ7Processor();
    const expectedField = createField(Morphism.I);
    assertEquals(fieldsAreEqual(processor.field, expectedField), true, "Initial field should be pure Identity");
});

Deno.test("T_3D: Identity rules (I, j, k) -> k", () => {
    const testJ = Morphism.And;
    const testK = Morphism.Cond;
    const result = T_3D[Morphism.I][testJ][testK];
    const expected = createField(testK);
    assertEquals(fieldsAreEqual(result!, expected), true, `T_3D[I][${MORPHISM_NAMES[testJ]}][${MORPHISM_NAMES[testK]}] should be Field dominated by ${MORPHISM_NAMES[testK]}`);
});

Deno.test("T_3D: Identity rules (i, I, k) -> i", () => {
    const testI = Morphism.Lambda;
    const testK = Morphism.Apply;
    const result = T_3D[testI][Morphism.I][testK]; // This is T_3D[Lambda][I][Apply]
    // Due to the specific beta-reduction rule T_3D[Lambda][I][Apply] = fieldI,
    // we expect fieldI here.
    const expected = createField(Morphism.I);
    assertEquals(fieldsAreEqual(result!, expected), true, `T_3D[${MORPHISM_NAMES[testI]}][I][${MORPHISM_NAMES[testK]}] should be Field dominated by I due to beta-reduction`);
});

Deno.test("T_3D: Identity rules (i, j, I) -> i", () => {
    const testI = Morphism.Lambda;
    const testJ = Morphism.Apply;
    const result = T_3D[testI][testJ][Morphism.I];
    const expected = createField(testI);
    assertEquals(fieldsAreEqual(result!, expected), true, `T_3D[${MORPHISM_NAMES[testI]}][${MORPHISM_NAMES[testJ]}][I] should be Field dominated by ${MORPHISM_NAMES[testI]}`);
});

Deno.test("T_3D: Double Negation ¬(¬X) -> X (simplified)", () => {
    const result = T_3D[Morphism.I][Morphism.Not][Morphism.Not];
    const expected = createField(Morphism.I);
    assertEquals(fieldsAreEqual(result!, expected), true, `Double negation should resolve to Field dominated by Identity`);
});

Deno.test("T_3D: Simplified Beta-reduction (Lambda I @) -> I", () => {
    const result = T_3D[Morphism.Lambda][Morphism.I][Morphism.Apply];
    const expected = createField(Morphism.I);
    assertEquals(fieldsAreEqual(result!, expected), true, `(λ I @) should resolve to Field dominated by I`);
});

Deno.test("T_3D: Simple AND logic (True AND True) -> True", () => {
    const result = T_3D[Morphism.I][Morphism.And][Morphism.I];
    const expected = createField(Morphism.I);
    assertEquals(fieldsAreEqual(result!, expected), true, `(I ∧ I) should be Field dominated by I`);
});

Deno.test("T_3D: Simple AND logic (True AND False) -> False", () => {
    const result = T_3D[Morphism.I][Morphism.And][Morphism.Not];
    const expected = createField(Morphism.Not);
    assertEquals(fieldsAreEqual(result!, expected), true, `(I ∧ ¬) should be Field dominated by Not`);
});

Deno.test("λ7Processor: No specific T_3D rule should increment incoming morphism", async () => {
    const processor = new λ7Processor();
    
    // Set initial history and field for the test.
    processor['history'] = [Morphism.Apply, Morphism.Lambda]; 
    processor.field.fill(0); 
    processor.field[Morphism.Apply] = 1.0; 
    processor.field[Morphism.Lambda] = 1.0; 
    // Field: [0,1,1,0,0,0,0]
    // History: [Apply, Lambda]

    // Process Cond
    // Current context for T_3D: (Apply, Lambda, Cond)
    // T_3D[Morphism.Apply][Morphism.Lambda][Morphism.Cond] is NULL
    await processor.eval([Morphism.Cond]); 

    // Expected: Current field [0,1,1,0,0,0,0]. No specific rule, so increment Cond.
    // Field becomes [0,1,1,0,0,1,0]. Normalize: [0, 1/3, 1/3, 0, 0, 1/3, 0]
    const expectedField = new Float32Array(BASIS_SIZE);
    expectedField[Morphism.Apply] = 1.0 / 3.0;
    expectedField[Morphism.Lambda] = 1.0 / 3.0;
    expectedField[Morphism.Cond] = 1.0 / 3.0; 
    
    assertEquals(fieldsAreEqual(processor.field, expectedField), true, "Should add incoming morphism and normalize if no rule found.");
});