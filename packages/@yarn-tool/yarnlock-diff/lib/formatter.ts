import chalk from "chalk";
import Table from "cli-table";
import { Diff } from "deep-diff";
import { _diffArray } from './formatter/diffArray';
import { _formatVersion } from './formatter/formatVersion';

export function buildDiffTable(diff: Diff<{}, {}>[]): string
{
	const table = new Table({
		head: [
			chalk.blueBright("package name"),
			chalk.blueBright("old version(s)"),
			chalk.blueBright("new version(s)"),
		],
		colWidths: [30, 50, 50],
	});
	const formatedDiff: Record<string, [string, string, string]> = {};
	diff.map(packageDiff =>
	{
		const path = packageDiff.path!.find(() => true) as string;
		switch (packageDiff.kind)
		{
			case "D":
				formatedDiff[path] = [
					path,
					chalk.red(_formatVersion(packageDiff.lhs)),
					"-",
				];
				break;
			case "N":
				formatedDiff[path] = [
					path,
					"-",
					chalk.green(_formatVersion(packageDiff.rhs)),
				];
				break;
			case "E":
				const lhs = chalk.yellow(
					_formatVersion(packageDiff.lhs),
				);
				const rhs = chalk.yellow(
					_formatVersion(packageDiff.rhs),
				);
				if (formatedDiff[path])
				{
					formatedDiff[path] = [
						path,
						`${formatedDiff[path][1]}, ${lhs}`,
						`${formatedDiff[path][2]}, ${rhs}`,
					];
				}
				else
				{
					formatedDiff[path] = [path, lhs, rhs];
				}
				break;
			case "A":
				const diffArray = _diffArray(packageDiff);
				formatedDiff[path] = [path, diffArray[0], diffArray[1]];
		}
	});
	Object.values(formatedDiff).forEach(tableRow => table.push(tableRow));
	return table.toString();
}
