import { IPackageJson } from '@ts-type/package-dts/package-json';
import { defaultWorkspaceRootScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/ws-root-scripts';
import { fillDummyScripts } from '@yarn-tool/pkg-entry-util/lib/preset/scripts/dummy';
// @ts-ignore
import { dependencies, devDependencies, peerDependencies } from './package.demo.json';
import _pkg from '../package.json';

/**
 * 取得新專案根目錄的預設 package.json 內容。
 *
 * @param name 套件名稱；未提供時保留 undefined 交由呼叫端補上。
 * @returns 含預設 scripts 與依賴的 package.json 物件。
 */
export function getDefaultPackageJson(name?: string): IPackageJson
{
	let json: IPackageJson = {
		"name": name,
		"version": "1.0.0",
		"private": true,
		// "packageManager": "yarn@1.22.19",
		"workspaces": [
			"packages/*",
		],
		/** 預設標記建立來源，方便日後辨識此專案由 yarn-tool 產生。 */
		keywords: [
			"create-by-yarn-tool",
		],
		"scripts": defaultWorkspaceRootScripts(),
		dependencies,
		devDependencies,
		peerDependencies,
		// "resolutions": {},
	} as any;

	/** 以本套件自身的依賴版本覆寫範本版本，確保產生的專案與工具列版本一致。 */
	for (const deps of ['dependencies', 'devDependencies', 'peerDependencies'] as const)
	{
		if (!json[deps])
		{
			continue;
		}
		const keys = Object.keys(json[deps]);

		/** 範本沒有該依賴欄位、或本套件也未宣告時略過，避免憑空新增空的依賴區塊。 */
		if (!keys.length || !_pkg[deps])
		{
			continue;
		}

		/** 複製一份再改寫，避免直接動到匯入的範本物件（其為模組快取中的共享實例）。 */
		json[deps] = {
			...json[deps],
		};

		keys
			.forEach(function (key)
			{
				/** 只覆寫本套件也宣告了的鍵，其餘保留範本預設版本。 */
				if (_pkg[deps][key])
				{
					json[deps][key] = _pkg[deps][key];
				}
			})
		;
	}

	/** 補上 workspaces 專用的預設腳本（已存在的腳本不會被覆蓋）。 */
	fillDummyScripts(json.scripts, 'workspaces');

	return json;
}

/**
 * 取得新專案根目錄的預設 tsconfig 內容。
 *
 * @returns 繼承 @bluelovers/tsconfig 的 tsconfig 物件。
 * @deprecated
 */
export function getDefaultTsconfig()
{
	return {
		extends: "@bluelovers/tsconfig/esm/mapfile.json",
	}
}
