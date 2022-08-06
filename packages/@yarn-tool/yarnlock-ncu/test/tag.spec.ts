import { join } from "path";
import { updateYarnLockTag } from '../lib/updateYarnLockTag';
import { readFileSync } from "fs";
import { __TEST_YARNLOCK } from '../../../../__root_ws';
import { printReport } from '../lib/printReport';
import stripAnsi from 'strip-ansi';
import { pathExistsSync } from 'fs-extra';
import { EnumDetectYarnLock } from '@yarn-tool/yarnlock-types';
import { _forEachVersionTags } from '../../../../test/lib/forEachVersionTags';

const TIMEOUT = 5 * 60 * 1000;

describe(`fixYarnLockTagUpdate`, () =>
{
	_forEachVersionTags().forEach(ver =>
	{
		describe(ver, () =>
		{
			const dir = join(__TEST_YARNLOCK, 'ncu', ver);

			if (!pathExistsSync(dir))
			{
				test(`dummy`, () => {})
			}
			else
			{
				test(`should update tag in yarn.lock`, async () =>
				{
					const file = join(dir, 'yarn.lock');
					let buf = readFileSync(file);

					let actual = await updateYarnLockTag(buf);

					console.dir(actual.yarnlock_changed);

					expect(actual).toHaveProperty(['yarnlock_changed'], true);

					console.dir(actual.report);

					expect(actual).toHaveProperty(['report', 'removed', 'next@canary']);
					expect(actual).toHaveProperty(['report', 'removed', 'typescript@next']);

					expect(actual).toMatchSnapshot({
						yarnlock_new: expect.any(String),
						yarnlock_old: expect.any(String),
						report: {
							removed: {
								'next@canary': {
									to: expect.any(String),
								},
								'typescript@next': {
									to: expect.any(String),
								},
							},
						},
					});

					console.log(printReport(actual.report));

				}, TIMEOUT);
			}

		});
	});

})
