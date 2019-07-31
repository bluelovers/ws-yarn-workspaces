
export function updateNotifier(__dirname: string, force?: boolean): void
{
	if (force || /node_modules/i.test(__dirname) || !require('@yarn-tool/is-npx').isNpx({
		__dirname,
	}))
	{
		const _updateNotifier = require('update-notifier') as typeof import('update-notifier');
		const pkg = require(require('path').join(__dirname, 'package.json'));
		return _updateNotifier({ pkg }).notify({
			// @ts-ignore
			shouldNotifyInNpmScript: true,
		});
	}
}

export default updateNotifier
