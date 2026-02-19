/**
 * @fileoverview Scope JSON Object Base Class - JSON/JSON/YAML
 * 
 * Provides base functionality for managing workspace scope arrays in JSON-like objects.
 * This is the parent class for both JSON and YAML scope handlers.
 * 
 * @module @yarn-tool/ws-scope/format/json-object
 */

import { arrayAdd, arrayRemove } from '../util/arrayAdd';

/**
 * Type definition for JSON object containing workspace scope array
 * JSON 2.0
 * 
 * @template K - The field name key (e.g., 'workspaces' or 'packages')
 * @description
 * Represents a JSON object structure where the specified field contains
 * an array of workspace scope paths.
 * 
 * @example
 * ```typescript
 * // For package.json with workspaces field
 * type PackageJsonWorkspaces = IJsonObject<'workspaces'>;
 * // { workspaces: string[] }
 * 
 * // For lerna.json with packages field
 * type LernaPackages = IJsonObject<'packages'>;
 * // { packages: string[] }
 * ```
 */
export type IJsonObject<K extends string> =
	{
		[p in K]: string[]
	}

/**
 * Base class for managing workspace scope arrays in configuration files
 * 
 * @class ScopeJsonObject
 * @template K - The field name key for the scope array
 * @description
 * Provides common functionality for adding, removing, and tracking changes
 * to workspace scope arrays in JSON-like configuration objects.
 * 
 * This class serves as the foundation for both JSON and YAML scope handlers,
 * offering a unified interface for workspace scope management.
 * 
 * @example
 * ```typescript
 * const scope = new ScopeJsonObject<'workspaces'>('/path/to/package.json', {
 *   field: 'workspaces'
 * });
 * scope.add('packages/*');
 * console.log(scope.changed); // true
 * ```
 */
export class ScopeJsonObject<K extends string = 'workspaces'>
{
	/**
	 * The parsed JSON object containing the scope array
	 * 
	 * @type {IJsonObject<K>}
	 */
	json: IJsonObject<K>;

	/**
	 * Flag indicating whether the scope array has been modified
	 * 
	 * @type {boolean}
	 */
	changed: boolean = false;

	/**
	 * The field name key for the scope array in the JSON object
	 * 
	 * @type {K}
	 */
	field: K;

	/**
	 * Creates a new ScopeJsonObject instance
	 * 
	 * @constructor
	 * @param {string} file - Path to the configuration file / 2.0
	 * @param {Object} [options] - Configuration options / 2.0
	 * @param {K} [options.field] - The field name for scope array / 2.0
	 */
	constructor(readonly file: string, protected options?: {
		field?: K,
	})
	{
		this._init();
	}

	/**
	 * Initializes the instance with default values
	 * 
	 * @protected
	 * @description Sets the field name from options or defaults to 'workspaces'
	 */
	protected _init()
	{
		// @ts-ignore
		this.field = this.options?.field ?? 'workspaces';
	}

	/**
	 * Checks if the JSON object has been loaded
	 * 
	 * @readonly
	 * @type {boolean}
	 * @returns {boolean} True if JSON object is loaded / 2.0
	 */
	get opened()
	{
		return !!this.json
	}

	/**
	 * Adds a scope path to the array
	 * 
	 * @param {string} scope - Scope path to add / 2.0
	 * @returns {boolean} True if the array was modified / 2.0
	 */
	add(scope: string)
	{
		let { changed, value } = arrayAdd(scope, this.value);

		this.value = value;
		this.changed ||= changed;

		return this.changed
	}

	/**
	 * Adds a scope path only if the file has been opened
	 * 
	 * @param {string} scope - Scope path to add / 2.0
	 * @returns {boolean|undefined} True if modified, undefined if not opened / 2.0
	 */
	addLazy(scope: string)
	{
		return this.opened && this.add(scope)
	}

	/**
	 * Removes a scope path from the array
	 * 
	 * @param {string} scope - Scope path to remove / 2.0
	 * @returns {boolean} True if the array was modified / 2.0
	 */
	remove(scope: string)
	{
		if (this.opened)
		{
			let { changed, value } = arrayRemove(scope, this.value);

			this.value = value;
			this.changed ||= changed;
		}

		return this.changed
	}

	/**
	 * Removes a scope path only if the file has been opened
	 * 
	 * @param {string} scope - Scope path to remove / 2.0
	 * @returns {boolean|undefined} True if modified, undefined if not opened / 2.0
	 */
	removeLazy(scope: string)
	{
		return this.opened && this.remove(scope)
	}

	/**
	 * Gets the scope array from the JSON object
	 * 
	 * @readonly
	 * @type {string[] | undefined}
	 * @returns {string[] | undefined} The scope array or undefined if not loaded / 2.0
	 */
	get value()
	{
		return this.json?.[this.field]
	}

	/**
	 * Sets the scope array in the JSON object
	 * 
	 * @param {string[]} value - New scope array value / 2.0
	 */
	set value(value: string[])
	{
		this.json[this.field] = value;
	}

}
