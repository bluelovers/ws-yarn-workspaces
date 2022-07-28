import { Argv } from 'yargs';

export type IUnpackYargsArgv<T extends Argv, D = any> = T extends Argv<infer U> ? U : D;

export function yargsProcessExit(msg: string | Error, code: number = 1)
{
	if (!(msg instanceof Error))
	{
		msg = new Error(msg);

		// @ts-ignore
		msg.code = code
	}

	console.error(msg.message);
	require('yargs').exit(code, msg);
	process.exit(code)
}
