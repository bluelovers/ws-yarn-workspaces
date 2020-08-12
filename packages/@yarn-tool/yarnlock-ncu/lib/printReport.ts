import { IYarnLockUpdateReport } from './types';
import { createDependencyTable } from '@yarn-tool/table/lib/core';
import { colorizeDiff, IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff/index';
import { IChalk, chalkByConsoleMaybe } from 'debug-color2/index';
import { _formatVersion } from '@yarn-tool/yarnlock-diff/lib/formatter/formatVersion';

export function printReport(report: IYarnLockUpdateReport, options?: {
	chalk?,
	console?,
})
{
	// @ts-ignore
	let chalk: IChalk = options?.chalk ?? chalkByConsoleMaybe(options?.console);

	const table = createDependencyTable({
		colAligns: ['left', 'center', 'center', 'center'],
		head: [
			chalk.bold.reset('package'),
			chalk.bold.reset('old version'),
			'',
			chalk.bold.reset('new version'),
		]
	});

	let formatedDiff: {
		[k: string]: [string, string, string, string];
	} = {};

	let _ok = false;
	const ARROW = chalk.gray('→');

	Object.entries(report?.removed ?? {})
		.forEach(([path, {
			from,
			to,
		}]) => {

			_ok = true;

			let lhs0 = _formatVersion(from);
			let rhs0 = _formatVersion(to);

			let lhs = chalk.red(lhs0);
			let rhs = chalk.yellow(colorizeDiff(lhs0, rhs0, options));

			let _arr: [string, string, string, string];
			_arr = [chalk.yellow(path), lhs, ARROW, rhs];

			_arr?.length > 0 && (formatedDiff[path] = _arr);
		})
	;

	table.push(...Object.values(formatedDiff))

	return _ok ? table.toString() : '';
}
