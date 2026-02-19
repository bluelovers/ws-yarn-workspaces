"use strict";
/**
 * @fileoverview Scope JSON Object Base Class - JSON/JSON/YAML
 *
 * Provides base functionality for managing workspace scope arrays in JSON-like objects.
 * This is the parent class for both JSON and YAML scope handlers.
 *
 * @module @yarn-tool/ws-scope/format/json-object
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeJsonObject = void 0;
const arrayAdd_1 = require("../util/arrayAdd");
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
class ScopeJsonObject {
    /**
     * Creates a new ScopeJsonObject instance
     *
     * @constructor
     * @param {string} file - Path to the configuration file / 2.0
     * @param {Object} [options] - Configuration options / 2.0
     * @param {K} [options.field] - The field name for scope array / 2.0
     */
    constructor(file, options) {
        this.file = file;
        this.options = options;
        /**
         * Flag indicating whether the scope array has been modified
         *
         * @type {boolean}
         */
        this.changed = false;
        this._init();
    }
    /**
     * Initializes the instance with default values
     *
     * @protected
     * @description Sets the field name from options or defaults to 'workspaces'
     */
    _init() {
        var _a, _b;
        // @ts-ignore
        this.field = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.field) !== null && _b !== void 0 ? _b : 'workspaces';
    }
    /**
     * Checks if the JSON object has been loaded
     *
     * @readonly
     * @type {boolean}
     * @returns {boolean} True if JSON object is loaded / 2.0
     */
    get opened() {
        return !!this.json;
    }
    /**
     * Adds a scope path to the array
     *
     * @param {string} scope - Scope path to add / 2.0
     * @returns {boolean} True if the array was modified / 2.0
     */
    add(scope) {
        let { changed, value } = (0, arrayAdd_1.arrayAdd)(scope, this.value);
        this.value = value;
        this.changed || (this.changed = changed);
        return this.changed;
    }
    /**
     * Adds a scope path only if the file has been opened
     *
     * @param {string} scope - Scope path to add / 2.0
     * @returns {boolean|undefined} True if modified, undefined if not opened / 2.0
     */
    addLazy(scope) {
        return this.opened && this.add(scope);
    }
    /**
     * Removes a scope path from the array
     *
     * @param {string} scope - Scope path to remove / 2.0
     * @returns {boolean} True if the array was modified / 2.0
     */
    remove(scope) {
        if (this.opened) {
            let { changed, value } = (0, arrayAdd_1.arrayRemove)(scope, this.value);
            this.value = value;
            this.changed || (this.changed = changed);
        }
        return this.changed;
    }
    /**
     * Removes a scope path only if the file has been opened
     *
     * @param {string} scope - Scope path to remove / 2.0
     * @returns {boolean|undefined} True if modified, undefined if not opened / 2.0
     */
    removeLazy(scope) {
        return this.opened && this.remove(scope);
    }
    /**
     * Gets the scope array from the JSON object
     *
     * @readonly
     * @type {string[] | undefined}
     * @returns {string[] | undefined} The scope array or undefined if not loaded / 2.0
     */
    get value() {
        var _a;
        return (_a = this.json) === null || _a === void 0 ? void 0 : _a[this.field];
    }
    /**
     * Sets the scope array in the JSON object
     *
     * @param {string[]} value - New scope array value / 2.0
     */
    set value(value) {
        this.json[this.field] = value;
    }
}
exports.ScopeJsonObject = ScopeJsonObject;
//# sourceMappingURL=json-object.js.map