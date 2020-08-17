import { sync as crossSpawn } from 'cross-spawn-extra';
import errcode from 'err-code';
import console from 'debug-color2';

export function assertExecInstall<T extends Record<any, any>>(cp: T)
{
	if (cp.status)
	{
		throw errcode(new Error(`Process finished with exit code ${cp.status}`), 'EXIT_CODE', {
			status: cp.status as number,
			cp,
		})
	}

	return cp;
}
