import { DiffService } from 'yarn-lock-diff/lib/diff-service';
import { FormatterService } from 'yarn-lock-diff/lib/formatter';
import { console } from 'debug-color2';
import { colorizeDiff } from '@yarn-tool/semver-diff';
import { IChalk } from 'debug-color2'
import { DiffArray } from 'deep-diff';
import { createDependencyTable } from '@yarn-tool/table/lib/core';

const { _formatVersion } = FormatterService;

export function yarnLockDiff(yarnlock_old: string, yarnlock_new: string): string
{
	let { chalk } = console;
	let _ok = false;

	const table = createDependencyTable();

	table.options.colAligns = ['left', 'center', 'center', 'center'];
	table.options.head = [
		chalk.bold.reset('package name'),
		chalk.bold.reset('old version(s)'),
		'',
		chalk.bold.reset('new version(s)'),
	];

	DiffService.buildDiff([yarnlock_old], [yarnlock_new])
		.map(function (diff)
		{
			let formatedDiff: {
				[k: string]: [string, string, string, string];
			} = {};

			const NONE = chalk.red('-');
			const ARROW = chalk.gray('→');

			diff
				.map(packageDiff =>
				{
					const path: string = packageDiff.path.find(() => true);

					_ok = true;

					let _arr: [string, string, string, string];

					switch (packageDiff.kind)
					{
						case 'A':

							let diffArray = _diffArray(packageDiff, chalk);

							_arr = [path, chalk.gray(diffArray[0]), ARROW, chalk.gray(diffArray[1])];

							break;
						case 'D':

							_arr = [chalk.red(path), chalk.red(_formatVersion(packageDiff.lhs)), ARROW, NONE];

							break;
						case 'E':

							let lhs0 = _formatVersion(packageDiff.lhs);
							let rhs0 = _formatVersion(packageDiff.rhs);

							let lhs = chalk.yellow(lhs0);
							let rhs = chalk.yellow(colorizeDiff(lhs0, rhs0));

							_arr = [chalk.yellow(path), lhs, ARROW, rhs];

							break;
						case 'N':

							_arr = [chalk.green(path), NONE, ARROW, chalk.green(_formatVersion(packageDiff.rhs))];

							break;
					}

					_arr && (formatedDiff[path] = _arr);

				})
			;

			table.push(...Object.values(formatedDiff))
		})
	;

	return _ok ? table.toString() : '';
}

export function _diffArray(array: DiffArray<{}, {}>, chalk: IChalk)
{
	const item = array.item;
	switch (item.kind)
	{
		case "N":
			return [`[...]`, `[..., ${chalk.green(_formatVersion(item.rhs))}]`];
		case "D":
			return [`[..., ${chalk.red(_formatVersion(item.lhs))}]`, `[...]`];
		case "E":
			return [
				`[...], ${chalk.yellow(_formatVersion(item.lhs))}]`,
				`[..., ${chalk.yellow(_formatVersion(item.lhs))}]`,
			];
		default:
			return [`[...]`, `[...]`];
	}
}
