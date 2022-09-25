import { ILernaJson } from '@ts-type/package-dts/lerna-json';
import { sortObjectKeys } from 'sort-object-keys2';
import { readJSONSync } from '@bluelovers/fs-json';
import { writePackageJSONSync } from '@yarn-tool/write-package-json';

export function sortLernaJsonCommandEntry<T extends Record<string, any>>(value: T)
{
	return sortObjectKeys(value, {
		keys: [
			'concurrency',
			'stream',
			'loglevel',
			'ignoreChanges',
			'message',
			'bump',
			'noPrivate',
			'conventionalCommits',
			'conventionalGraduate',
			'changelogPreset',
		],
		useSource: true,
	})
}

export function sortLernaJsonCommand<T extends ILernaJson["command"]>(value: T)
{
	Object.values(value).forEach(sortLernaJsonCommandEntry);

	return sortObjectKeys(value, {
		keys: [
			'publish',
			'version',
			'run',
			'exec',
		],
		useSource: true,
	})
}

export function sortLernaJson<T extends ILernaJson>(json: T)
{
	sortLernaJsonCommand(json.command);

	return sortObjectKeys(json, {
		keys: [
			'workspaces',
			'packages',
			'command',
			'npmClient',
			'useWorkspaces',
			'version',
		],
		useSource: true,
	})
}

export function sortLernaJsonFile<T extends ILernaJson>(file: string)
{
	return writePackageJSONSync(file, sortLernaJson(readJSONSync(file)))
}

export default sortLernaJson
