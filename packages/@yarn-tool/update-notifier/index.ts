
export type IUpdateNotifier = typeof import('update-notifier');

export function notNpxMaybe(__dirname: string)
{
	return __dirname && /node_modules/i.test(__dirname) || !require('@yarn-tool/is-npx').isNpx({
		__dirname,
	})
}

export function updateNotifier(__dirname: string, force?: boolean): IUpdateNotifier
{
	if (force || notNpxMaybe(__dirname))
	{
		const _updateNotifier = require('update-notifier') as IUpdateNotifier;
		const pkg = require(require('path').join(__dirname, 'package.json'));
		return _updateNotifier({ pkg }).notify({
			// @ts-ignore
			shouldNotifyInNpmScript: true,
		});
	}

	return null
}

export default updateNotifier
