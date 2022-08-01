import { join } from "path";
import { updateYarnLockTag } from '../lib/updateYarnLockTag';
import { readFileSync } from "fs";
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { printReport } from '../lib/printReport';
import stripAnsi from 'strip-ansi';

describe(`fixYarnLockTagUpdate`, () =>
{

	test(`should update tag in yarn.lock`, async () =>
	{
		let file = join(__TEST_YARNLOCK, 'ncu', 'v1', 'yarn.lock');
		let buf = readFileSync(file);

		let actual = await updateYarnLockTag(buf);

		console.dir(actual.yarnlock_changed);

		expect(actual).toHaveProperty(['yarnlock_changed'], true);

		console.dir(actual.report);

		expect(actual).toHaveProperty(['report', 'removed', 'next@canary']);
		expect(actual).toHaveProperty(['report', 'removed', 'typescript@next']);


	}, 5 * 60 * 1000);

})
