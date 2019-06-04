
export function updateNotifier(__dirname: string, force?: boolean)
{
	if (force || /node_modules/i.test(__dirname) || !require('is-npx')())
	{
		const _updateNotifier = require('update-notifier');
		const pkg = require(require('path').join(__dirname, 'package.json'));
		return _updateNotifier({ pkg }).notify({
			shouldNotifyInNpmScript: true,
		});
	}
}

export default updateNotifier
