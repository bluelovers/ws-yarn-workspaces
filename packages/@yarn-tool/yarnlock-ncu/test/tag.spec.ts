import { join } from "path";
import { updateYarnLockTag } from '../lib/updateYarnLockTag';
import { readFileSync } from "fs";

describe(`fixYarnLockTagUpdate`, () =>
{

	test(`should update tag in yarn.lock`, async (done) =>
	{
		let file = join(__dirname, './fixtures/v1/yarn.lock');
		let buf = readFileSync(file);

		let actual = await updateYarnLockTag(buf);

		console.dir(actual.yarnlock_changed);

		expect(actual).toHaveProperty(['yarnlock_changed'], true);

		console.dir(actual.report);

		expect(actual).toHaveProperty(['report', 'removed', 'next@canary']);
		expect(actual).toHaveProperty(['report', 'removed', 'typescript@next']);

		return done()
	}, 5 * 60 * 1000);

})
