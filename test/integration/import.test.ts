import { GLOBAL } from '../../src/configs/poku.js';
import { skip } from '../../src/modules/helpers/skip.js';
import { test } from '../../src/modules/helpers/test.js';

if (GLOBAL.runtime === 'deno') skip();

test(async () => {
  const index = await import('../../src/modules/index.js');

  index.test('Import Suite', () => {
    index.assert.ok(index.poku, 'Importing poku method');
    index.assert.ok(index.assert, 'Importing assert method');
    index.assert.ok(index.strict, 'Importing strict method');

    index.assert.ok(index.defineConfig, 'Importing defineConfig method');
    index.assert.ok(index.envFile, 'Importing envFile method');
    index.assert.ok(index.startService, 'Importing startService method');
    index.assert.ok(index.startScript, 'Importing startScript method');
    index.assert.ok(index.docker, 'Importing docker method');
    index.assert.ok(index.getPIDs, 'Importing getPIDs helper');
    index.assert.ok(index.kill, 'Importing kill helper');
    index.assert.ok(index.describe, 'Importing describe helper');
    index.assert.ok(index.beforeEach, 'Importing beforeEach helper');
    index.assert.ok(index.afterEach, 'Importing afterEach helper');
    index.assert.ok(index.log, 'Importing log helper');
    index.assert.ok(index.test, 'Importing test helper');
    index.assert.ok(index.skip, 'Importing skip helper');
    index.assert.ok(index.sleep, 'Importing sleep helper');
    index.assert.ok(
      index.waitForExpectedResult,
      'Importing waitForExpectedResult helper'
    );
    index.assert.ok(index.waitForPort, 'Importing waitForPort helper');
    index.assert.ok(index.exit, 'Importing exit helper');
    index.assert.ok(index.listFiles, 'Importing listFiles helper');
    index.assert.ok(
      typeof index.version === 'string',
      'Importing listFiles helper'
    );
  });
});
