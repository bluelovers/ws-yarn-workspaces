import { Command, flags } from "@oclif/command";

import { buildDiffTable } from './formatter';
import { buildDiff } from './diff-service';
import { extname, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

export class YarnLockDiff extends Command
{
	static description =
		"Given one or more old yarn.lock files and one or more new yarn.lock files, compute the diff";

	static flags = {
		version: flags.version({ char: "v" }),
		help: flags.help({ char: "h" }),
		old: flags.string({
			char: "o",
			description: "old yarn.lock file(s)",
			multiple: true,
			required: true,
		}),
		new: flags.string({
			char: "n",
			description: "new yarn.lock file(s)",
			multiple: true,
			required: true,
		}),
	};

	checkIfExist = (filePathString: string) =>
	{
		const filePath = resolve(process.cwd(), filePathString);
		return existsSync(filePath);
	};

	reportNonExistantFiles = (filePathString: string) =>
	{
		if (!this.checkIfExist(filePathString))
		{
			this.error(`File does not exist "${filePathString}"`);
		}
		return filePathString;
	};

	checkIfLockFile = (filePathString: string) =>
	{
		const fileExtension = extname(filePathString);
		return fileExtension === ".lock";
	};

	reportNonLockFile = (filePathString: string) =>
	{
		if (!this.checkIfLockFile(filePathString))
		{
			this.error(`File is not a lock file "${filePathString}"`);
		}
		return filePathString;
	};

	async run()
	{
		const { flags } = this.parse(YarnLockDiff);

		const oldYarnLockPaths = flags.old;
		const newYarnLockPaths = flags.new;

		[...oldYarnLockPaths, ...newYarnLockPaths]
			.map(this.reportNonExistantFiles)
			.map(this.reportNonLockFile);

		const oldContents = oldYarnLockPaths.map(path =>
			readFileSync(path, "utf8"),
		);
		const newContents = newYarnLockPaths.map(path =>
			readFileSync(path, "utf8"),
		);

		buildDiff(oldContents, newContents)
			.map(buildDiffTable)
			.map(this.log);
	}
}

export default YarnLockDiff;
