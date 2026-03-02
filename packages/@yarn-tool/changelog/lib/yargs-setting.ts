/**
 * Yargs CLI 設定模組
 * Yargs CLI Configuration Module
 *
 * 設定 changelog 命令列工具的參數選項
 * Configures CLI argument options for changelog tool
 *
 * Created by user on 2020/6/15.
 */

import { Arguments, Argv, Omit } from 'yargs';
import { IYargsSync, IYargsUnPackArgv } from '@yarn-tool/types';

/**
 * 設定 yargs 參數選項
 * Setup yargs argument options
 *
 * @param {Argv<T>} yargs - Yargs 實例 / Yargs instance
 * @returns {IYargsSync<typeof _return>} 設定後的 Yargs 實例 / Configured yargs instance
 */
export function setupToYargs<T>(yargs: Argv<T>)
{
	const _return = yargs
		/**
		 * 預設規範選項
		 * Preset option
		 */
		.option('preset', {
			desc: `Name of the preset you want to use. Must be one of the following:\n@bluelovers/conventional-changelog-bluelovers, angular, atom, codemirror, ember, eslint, express, jquery, jscs or jshint`,
			alias: ['p', 'changelogPreset'],
			string: true,
		})
		/**
		 * Lerna 套件模式選項
		 * Lerna package mode option
		 */
		.option('lerna-package', {
			desc: `Generate a changelog for a specific lerna package (:pkg-name@1.0.0)`,
			alias: 'l',
			boolean: true,
			default: true,
		})
		/**
		 * Changelog 類型選項
		 * Changelog type option
		 */
		.option('type', {
			string: true,
		})
		/**
		 * 標籤前綴選項
		 * Tag prefix option
		 */
		.option('tag-prefix', {
			desc: `Tag prefix to consider when reading the tags`,
			alias: 't',
			string: true,
		})
		/**
		 * 工作目錄選項
		 * Working directory option
		 */
		.option('cwd', {
			default: process.cwd(),
			normalize: true,
		})
	;

	return _return as any as IYargsSync<typeof _return>
}

/**
 * 預設匯出設定函數
 * Default export setup function
 */
export default setupToYargs
