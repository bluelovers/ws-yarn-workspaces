import { ITSRequiredPick } from 'ts-type/lib/type/record';
import { IFillPkgHostedInfoOptions } from '@yarn-tool/pkg-hosted-info';
import { resolve } from 'path';
import { existsSync, readJSONSync } from 'fs-extra';
import { defaultsDeep, merge } from 'lodash';
import { __STATIC_ROOT } from '@yarn-tool/static-file/__root';
import { writePackageJSONSync } from '@yarn-tool/write-package-json';
import { ILernaJson } from '@ts-type/package-dts/lerna-json';
import { array_unique_overwrite } from 'array-hyper-unique';

export function _fixLernaJsonCore(current: ILernaJson, tpl: ILernaJson)
{
	current.command = defaultsDeep(current.command, tpl.command);

	current.command.publish.ignoreChanges = (current.command.publish.ignoreChanges as string[]).concat(tpl.command.publish.ignoreChanges as string[]);

	array_unique_overwrite(current.command.publish.ignoreChanges);

	return current
}

export function _fixLernaJson(options: ITSRequiredPick<IFillPkgHostedInfoOptions, 'rootData'>)
{
	const file = resolve(options.rootData.root, 'lerna.json');

	if (existsSync(file))
	{
		let json = readJSONSync(file);
		let json2 = readJSONSync(resolve(__STATIC_ROOT, 'file/lerna.json.tpl'));

		json = _fixLernaJsonCore(json, json2);

		writePackageJSONSync(file, json);
	}
}
