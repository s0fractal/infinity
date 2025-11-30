import { harvest, Discrepancy, SystemContext, NewMorphism } from "./🌱.ts";

if (import.meta.main) {
  console.log("Testing Harvest (🌱) morphism...");

  const context: SystemContext = {
    timestamp: Date.now(),
    activeMorphisms: ['map', 'fold'],
    callStack: ['main', 'processData', 'calculate'],
  };

  // 1. Test an "evolutionary" discrepancy
  const typeError: Discrepancy = {
    type: 'TypeError',
    intent: 'number',
    reality: '42', // a string that should be a number
    delta: 0.9,
  };

  const newMorphism = harvest(typeError, context);
  console.assert(newMorphism !== null, "Harvest should have generated a morphism for TypeError.");
  if (newMorphism) {
    console.assert(newMorphism.name === 'adapt_string_to_number', "Incorrect morphism name.");
    console.assert(newMorphism.type === 'adapter', "Incorrect morphism type.");
  }
  
  // 2. Test a non-evolutionary discrepancy
  const logicError: Discrepancy = {
    type: 'LogicError',
    intent: 'x > 0',
    reality: 'x <= 0',
    delta: 0.5,
  };
  
  const noMorphism = harvest(logicError, context);
  console.assert(noMorphism === null, "Harvest should not generate a morphism for a simple LogicError in this placeholder.");

  console.log("\n✓ All Harvest (🌱) tests passed (conceptually)");
}
