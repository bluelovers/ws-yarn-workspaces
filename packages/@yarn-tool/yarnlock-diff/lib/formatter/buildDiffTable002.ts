import { EnumKinds, IDiffNode } from '@bluelovers/deep-diff';
import { IComputedPackage } from '../diff-service/types';
import { _formatVersion } from './formatVersion';
import { _diffArray } from './diffArray002';
import { colorizeDiff, IOptionsParseVersionsDiff } from '@yarn-tool/semver-diff';
import { createDependencyTable } from '@yarn-tool/table/lib/core';
import { chalkByConsoleMaybe, IChalk } from 'debug-color2'
import stripAnsi from 'strip-ansi';

export function buildDiffTable(diff: IDiffNode<IComputedPackage, IComputedPackage>[],
	options?: IOptionsParseVersionsDiff,
): string
{
	// @ts-ignore
	let chalk: IChalk = options?.chalk ?? chalkByConsoleMaybe(options?.console);
	let _ok = false;

	options = {
		...options,
		chalk,
	}

	const table = createDependencyTable({
		colAligns: ['left', 'center', 'center', 'center'],
		head: [
			chalk.bold.reset('package name'),
			chalk.bold.reset('old version(s)'),
			'',
			chalk.bold.reset('new version(s)'),
		],
	});

	let formatedDiff: {
		[k: string]: [string, string, string, string];
	} = {};

	const NONE = chalk.red('-');
	const ARROW = chalk.gray('→');

	diff
		.map(packageDiff =>
		{
			//const path: string = packageDiff.path.find(() => true);
			const path: string = packageDiff.path[0] as any;

			_ok = true;

			let _arr: [string, string, string, string];

			switch (packageDiff.kind)
			{
				case EnumKinds.DiffArray:

					let diffArray = _diffArray(packageDiff, chalk);

					_arr = [path, chalk.gray(diffArray[0]), ARROW, chalk.gray(diffArray[1])];

					break;
				case EnumKinds.DiffDeleted:

					_arr = [chalk.red(path), chalk.red(_formatVersion(packageDiff.lhs)), ARROW, NONE];

					break;
				case EnumKinds.DiffEdit:

					let lhs0 = _formatVersion(packageDiff.lhs);
					let rhs0 = _formatVersion(packageDiff.rhs);

					let lhs = chalk.yellow(lhs0);
					let rhs = chalk.yellow(colorizeDiff(lhs0, rhs0, options));

					_arr = [chalk.yellow(path), lhs, ARROW, rhs];

					break;
				case EnumKinds.DiffNew:

					_arr = [chalk.green(path), NONE, ARROW, chalk.green(_formatVersion(packageDiff.rhs))];

					break;
			}

			_arr && (formatedDiff[path] = _arr);

		})
	;

	table.push(...Object.values(formatedDiff));

	let output = _ok ? table.toString() : '';

	if (options?.stripAnsi === true)
	{
		output = stripAnsi(output);
	}

	return _ok ? output : '';
}
