import { fsYarnLockSafe } from '@yarn-tool/yarnlock-fs/lib/read';
import { printReport, updateYarnLockTag } from '@yarn-tool/yarnlock-ncu';
import { writeFileSync } from 'fs-extra';
import { IArgvRuntime, IRuntime, IRuntimeInput } from './types';

export async function _handleNcuYarnLock(argv: IArgvRuntime, runtime: Pick<IRuntime, 'rootData' | 'consoleDebug' | 'console'>,)
{
	const { rootData, consoleDebug, console } = runtime;

	const yl = fsYarnLockSafe(rootData.root);

	if (yl.yarnlock_exists)
	{
		const ret = await updateYarnLockTag(yl.yarnlock_old);

		if (ret.yarnlock_changed)
		{
			consoleDebug.magenta.info(`higher versions exists on registry`);

			const s = printReport(ret.report);
			s?.length > 0 && console.log(s);

			if (argv.upgrade)
			{
				writeFileSync(yl.yarnlock_file, ret.yarnlock_new);
				consoleDebug.magenta.info(`yarn.lock updated`);
				consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt install`), ` , for upgrade dependencies now`);
			}
			else
			{
				consoleDebug.log(`you can do `, console.bold.cyan.chalk(`yt ncu -u`), ` , for update yarn.lock`);
			}
		}
	}
}
