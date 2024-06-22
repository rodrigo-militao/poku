/* c8 ignore start */ // c8 bug
import { cwd as processCWD, hrtime, env } from 'node:process';
import { relative } from 'node:path';
import { spawn } from 'node:child_process';
import { indentation } from '../configs/indentation.js';
import { fileResults } from '../configs/files.js';
import { isWindows, runner } from '../helpers/runner.js';
import { format } from '../helpers/format.js';
import { isQuiet, printOutput, write } from '../helpers/logs.js';
import { beforeEach, afterEach } from './each.js';
/* c8 ignore next */
import type { Configs } from '../@types/poku.js';

const cwd = processCWD();
/* c8 ignore stop */ // c8 bug

/* c8 ignore next */ // c8 bug
export const runTestFile = (
  filePath: string,
  configs?: Configs
): Promise<boolean> =>
  new Promise(async (resolve) => {
    /* c8 ignore start */
    const runtimeOptions = runner(filePath, configs);
    const runtime = runtimeOptions.shift()!;
    const runtimeArguments = [
      ...runtimeOptions,
      configs?.deno?.cjs === true ||
      (Array.isArray(configs?.deno?.cjs) &&
        configs.deno.cjs.some((ext) => filePath.includes(ext)))
        ? 'https://cdn.jsdelivr.net/npm/poku/lib/polyfills/deno.mjs'
        : filePath,
    ];
    /* c8 ignore stop */

    const fileRelative = relative(cwd, filePath);
    const showLogs = !isQuiet(configs);

    let output = '';

    const stdOut = (data: Buffer): void => {
      output += String(data);
    };

    if (!configs?.parallel) {
      showLogs &&
        write(
          `${indentation.test}${format('●').info().dim()} ${format(fileRelative).dim()}`
        );
    }

    const start = hrtime();
    let end: ReturnType<typeof hrtime>;

    /* c8 ignore next */
    if (!(await beforeEach(fileRelative, configs))) return false;

    // Export spawn helper is not an option
    const child = spawn(runtime, runtimeArguments, {
      stdio: ['inherit', 'pipe', 'pipe'],
      /* c8 ignore next */
      shell: isWindows,
      env: {
        ...env,
        FILE: configs?.parallel || configs?.deno?.cjs ? fileRelative : '',
      },
    });

    child.stdout.on('data', stdOut);

    child.stderr.on('data', stdOut);

    child.on('close', async (code) => {
      end = hrtime(start);

      const result = code === 0;

      if (showLogs)
        printOutput({
          output,
          result,
          configs,
        });

      /* c8 ignore next */
      if (!(await afterEach(fileRelative, configs))) return false;

      const total = (end[0] * 1e3 + end[1] / 1e6).toFixed(6);

      if (result) fileResults.success.set(fileRelative, total);
      else fileResults.fail.set(fileRelative, total);

      resolve(result);
    });

    /* c8 ignore start */
    child.on('error', (err) => {
      end = hrtime(start);

      const total = (end[0] * 1e3 + end[1] / 1e6).toFixed(6);

      console.error(`Failed to start test: ${filePath}`, err);
      fileResults.fail.set(fileRelative, total);

      resolve(false);
    });
    /* c8 ignore stop */
  });
