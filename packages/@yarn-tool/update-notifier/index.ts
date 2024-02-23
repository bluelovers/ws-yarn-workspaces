
export type IUpdateNotifier = typeof import('update-notifier');
export type IUpdateNotifierObject = ReturnType<IUpdateNotifier>;
import { NotifyOptions, Settings } from 'update-notifier';
import { join } from 'path';
import ciDetect from '@npmcli/ci-detect';

export function notNpxMaybe(__dirname: string): boolean
{
	if (__dirname && /ypx_|_npx/i.test(__dirname))
	{
		return false
	}

	return !ciDetect() && !require('@yarn-tool/is-npx').isNpx({
		__dirname,
	})
}

export function updateNotifier(__dirname: string | string[], force?: boolean, inputNoticeOptions?: Settings & NotifyOptions): IUpdateNotifierObject
{
	if (Array.isArray(__dirname))
	{
		__dirname = join(...__dirname);
	}

	if (force || (force == null) && notNpxMaybe(__dirname))
	{
		let noticeOptions: Settings & NotifyOptions = {
			shouldNotifyInNpmScript: false,
			updateCheckInterval: 1000 * 60 * 60 * 24 * 7,
			...inputNoticeOptions,
		};

		const _updateNotifier = require('update-notifier') as IUpdateNotifier;
		const pkg = require(require('path').join(__dirname, 'package.json'));
		const obj = _updateNotifier({
			...noticeOptions,
			pkg,
		});

		obj.notify(noticeOptions);

		return obj;
	}

	return null
}

export default updateNotifier
