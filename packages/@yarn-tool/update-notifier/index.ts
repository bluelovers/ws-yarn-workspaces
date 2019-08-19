
export type IUpdateNotifier = typeof import('update-notifier');
export type IUpdateNotifierObject = ReturnType<IUpdateNotifier>;

export function notNpxMaybe(__dirname: string): boolean
{
	return __dirname && /node_modules/i.test(__dirname) || !require('@yarn-tool/is-npx').isNpx({
		__dirname,
	})
}

export function updateNotifier(__dirname: string, force?: boolean): IUpdateNotifierObject
{
	if (force || notNpxMaybe(__dirname))
	{
		const _updateNotifier = require('update-notifier') as IUpdateNotifier;
		const pkg = require(require('path').join(__dirname, 'package.json'));
		const obj = _updateNotifier({ pkg });

		obj.notify({
			// @ts-ignore
			shouldNotifyInNpmScript: true,
		});

		return obj;
	}

	return null
}

export default updateNotifier
