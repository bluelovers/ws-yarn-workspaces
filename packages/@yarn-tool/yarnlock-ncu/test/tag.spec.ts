import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import { join } from "path";
import { updateYarnLockTag } from '../lib/updateYarnLockTag';
import { readFileSync } from "fs";
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { printReport } from '../lib/printReport';
import stripAnsi from 'strip-ansi';
import { pathExistsSync } from 'fs-extra';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';

const TIMEOUT = 5 * 60 * 1000;

describe(`fixYarnLockTagUpdate`, () =>
{
	_forEachVersionTags().forEach(ver =>
	{
		describe(ver as any, () =>
		{
			const dir = join(__TEST_YARNLOCK, 'ncu', ver as any);

			if (!pathExistsSync(dir))
			{
				test(`dummy`, () => {})
			}
			else
			{
				test(`should update tag in yarn.lock`, { timeout: TIMEOUT }, async (t) =>
				{
					const file = join(dir, 'yarn.lock');
					let buf = readFileSync(file);

					let actual = await updateYarnLockTag(buf);

					console.dir(actual.yarnlock_changed);

					assert.strictEqual(actual.yarnlock_changed, true);

					console.dir(actual.report);

					assert.notStrictEqual(actual.report?.removed?.['next@canary'], undefined);
					assert.notStrictEqual(actual.report?.removed?.['typescript@next'], undefined);

					/*
					 * 原本是 Jest property matcher 快照，node:test 無等效寫法，
					 * 改以逐欄斷言保留 matcher 語意，再對實際值做快照
					 * / Jest property-matcher snapshot has no node:test equivalent;
					 * kept matcher semantics via per-field assertions, then snapshot the actual value
					 */
					assert.strictEqual(typeof actual.yarnlock_new, 'string');
					assert.strictEqual(typeof actual.yarnlock_old, 'string');
					assert.strictEqual(typeof actual.report?.removed?.['next@canary']?.to, 'string');
					assert.strictEqual(typeof actual.report?.removed?.['typescript@next']?.to, 'string');
					assert.strictEqual(typeof actual.report?.removed?.['dts-bundle-generator@npm:@bluelovers/dts-bundle-generator']?.to, 'string');

					t.assert.snapshot(actual);

					console.log(printReport(actual.report));

				});
			}

		});
	});

})
