import { execSync } from 'node:child_process';
import { inspectCLI, isBuild } from '../__utils__/capture-cli.test.js';
import { assert } from '../../src/modules/essentials/assert.js';
import { describe } from '../../src/modules/helpers/describe.js';
import { it } from '../../src/modules/helpers/it/core.js';
import { skip } from '../../src/modules/helpers/skip.js';

if (isBuild) skip();

const hasNode = (() => {
  try {
    execSync('node -v', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

const hasDeno = (() => {
  try {
    execSync('deno -v', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

const hasBun = (() => {
  try {
    execSync('bun -v', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
})();

describe('Test Runtimes/Platforms + Extensions', async () => {
  hasNode &&
    (await it('Node.js', async () => {
      const output = await inspectCLI(
        'npx tsx src/bin/index.ts test/__fixtures__/e2e/extensions -d'
      );

      if (output.exitCode !== 0) {
        console.log(output.stdout);
        console.log(output.stderr);
      }

      assert.strictEqual(output.exitCode, 0, 'Exit Code needs to be 0');
      assert(/PASS › 12/.test(output.stdout), 'CLI needs to pass 12');
      assert(/FAIL › 0/.test(output.stdout), 'CLI needs to fail 0');
    }));

  hasBun &&
    (await it('Bun', async () => {
      const output = await inspectCLI(
        'bun src/bin/index.ts test/__fixtures__/e2e/extensions -d'
      );

      if (output.exitCode !== 0) {
        console.log(output.stdout);
        console.log(output.stderr);
      }

      assert.strictEqual(output.exitCode, 0, 'Exit Code needs to be 0');
      assert(/PASS › 12/.test(output.stdout), 'CLI needs to pass 12');
      assert(/FAIL › 0/.test(output.stdout), 'CLI needs to fail 0');
    }));

  hasDeno &&
    (await it('Deno', async () => {
      const output = await inspectCLI(
        'deno run --unstable-sloppy-imports --allow-read --allow-env --allow-run src/bin/index.ts test/__fixtures__/e2e/extensions -d'
      );

      if (output.exitCode !== 0) {
        console.log(output.stdout);
        console.log(output.stderr);
      }

      assert.strictEqual(output.exitCode, 0, 'Exit Code needs to be 0');
      assert(/PASS › 12/.test(output.stdout), 'CLI needs to pass 12');
      assert(/FAIL › 0/.test(output.stdout), 'CLI needs to fail 0');
    }));
});
