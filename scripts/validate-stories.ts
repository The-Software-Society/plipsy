import { validateAll } from '../src/stories';

let failed = 0;
for (const result of validateAll()) {
  if (result.errors.length === 0) {
    console.log(`  ✓ ${result.storyId}`);
    continue;
  }
  failed++;
  console.error(`  ✗ ${result.storyId}`);
  for (const err of result.errors) console.error(`      ${err}`);
}

if (failed > 0) {
  console.error(`\n${failed} story(ies) failed validation`);
  process.exit(1);
}
console.log('\nAll stories valid.');
