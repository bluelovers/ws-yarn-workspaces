/**
 * @fileoverview Scope YAML Handler - YAML 2.0
 * 
 * Provides functionality for managing workspace scope arrays in YAML configuration files.
 * Handles reading, writing, and modifying YAML files like pnpm-workspace.yaml
 * while preserving original formatting and comments.
 * 
 * @module @yarn-tool/ws-scope/format/yaml
 */

import { pathExistsSync, readFileSync, writeFileSync } from 'fs-extra';
import { IJsonObject, ScopeJsonObject } from './json-object';
import YAWN from 'yawn-yaml';

/**
 * Symbol for storing the raw YAWN instance
 * 
 * @constant {symbol}
 * @description Used to store the YAWN YAML parser instance privately
 */
const SymRaw = Symbol.for('raw');

export { SymRaw }

/**
 * YAML file scope handler for workspace configuration
 * YAML 2.0
 * 
 * @class ScopeYaml
 * @extends ScopeJsonObject<K>
 * @template K - The field name key (default: 'packages')
 * @description
 * Extends ScopeJsonObject to provide YAML-specific file operations.
 * Uses YAWN (YAML AST) to preserve original formatting, comments,
 * and structure when modifying YAML files.
 * 
 * This is particularly useful for pnpm-workspace.yaml files where
 * preserving the original format is important.
 * 
 * @example
 * ```typescript
 * const handler = new ScopeYaml<'packages'>('/path/to/pnpm-workspace.yaml', {
 *   field: 'packages'
 * });
 * handler.loadFileLazy();
 * handler.add('packages/*');
 * handler.saveFile();
 * ```
 */
export class ScopeYaml<K extends string = 'packages'> extends ScopeJsonObject<K>
{
	/**
	 * Internal YAWN instance for YAML parsing and stringification
	 * 
	 * @type {YAWN}
	 */
	[SymRaw]: YAWN

	/**
	 * Initializes the instance with YAML-specific defaults
	 * 
	 * @protected
	 * @override
	 * @description Sets the default field name to 'packages' for YAML files
	 */
	protected override _init()
	{
		// @ts-ignore
		this.field = this.options?.field ?? 'packages';
	}

	/**
	 * Gets the JSON representation of the YAML content
	 * 
	 * @override
	 * @type {IJsonObject<K>}
	 * @returns {IJsonObject<K>} The parsed YAML as JSON object / 2.0
	 */
	// @ts-ignore
	override get json()
	{
		return this[SymRaw]?.json as IJsonObject<K>;
	}

	/**
	 * Sets the JSON content and updates the YAML representation
	 * 
	 * @override
	 * @param {IJsonObject<K>} json - The JSON object to set / 2.0
	 */
	override set json(json: IJsonObject<K>)
	{
		this[SymRaw].json = json;
	}

	/**
	 * Gets the scope array from the YAML content
	 * 
	 * @override
	 * @type {string[] | undefined}
	 * @returns {string[] | undefined} The scope array or undefined / 2.0
	 */
	override get value()
	{
		return this.json?.[this.field]
	}

	/**
	 * Sets the scope array in the YAML content
	 * 
	 * @override
	 * @param {string[]} value - New scope array value / 2.0
	 */
	override set value(value: string[])
	{
		const json = this.json;
		json[this.field] = value;
		this.json = json;
	}

	/**
	 * Checks if the YAML file exists on disk
	 * 
	 * @returns {boolean} True if file exists / 2.0
	 */
	existsFile()
	{
		return pathExistsSync(this.file)
	}

	/**
	 * Checks if the YAML file has been loaded
	 * 
	 * @override
	 * @readonly
	 * @type {boolean}
	 * @returns {boolean} True if YAWN instance exists / 2.0
	 */
	override get opened()
	{
		return !!this[SymRaw]
	}

	/**
	 * Loads the YAML file content into memory
	 * 
	 * @param {boolean} [reload] - Force reload even if already loaded / 2.0
	 * @returns {IJsonObject<K>} The parsed YAML as JSON object / 2.0
	 */
	loadFile(reload?: boolean)
	{
		if (reload || !this.opened)
		{
			let input = readFileSync(this.file).toString();
			let raw = new YAWN(input);
			this[SymRaw] = raw;
		}

		return this.json
	}

	/**
	 * Saves the YAML content back to disk
	 * 
	 * @description
	 * Uses YAWN's yaml property to maintain original formatting
	 * and comments when writing back to the file.
	 * 
	 * 2.0
	 */
	saveFile()
	{
		if (this.opened)
		{
			writeFileSync(this.file, this[SymRaw].yaml)
		}
	}

	/**
	 * Loads the YAML file only if it exists
	 * 
	 * @param {boolean} [reload] - Force reload even if already loaded / 2.0
	 * @returns {IJsonObject<K>|false} The parsed YAML or false if file doesn't exist / 2.0
	 */
	loadFileLazy(reload?: boolean)
	{
		return this.existsFile() && this.loadFile(reload)
	}

}
