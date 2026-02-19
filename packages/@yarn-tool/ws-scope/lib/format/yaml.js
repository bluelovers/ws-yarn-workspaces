"use strict";
/**
 * @fileoverview Scope YAML Handler - YAML 2.0
 *
 * Provides functionality for managing workspace scope arrays in YAML configuration files.
 * Handles reading, writing, and modifying YAML files like pnpm-workspace.yaml
 * while preserving original formatting and comments.
 *
 * @module @yarn-tool/ws-scope/format/yaml
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeYaml = exports.SymRaw = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const json_object_1 = require("./json-object");
const yawn_yaml_1 = tslib_1.__importDefault(require("yawn-yaml"));
/**
 * Symbol for storing the raw YAWN instance
 *
 * @constant {symbol}
 * @description Used to store the YAWN YAML parser instance privately
 */
const SymRaw = Symbol.for('raw');
exports.SymRaw = SymRaw;
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
class ScopeYaml extends json_object_1.ScopeJsonObject {
    /**
     * Initializes the instance with YAML-specific defaults
     *
     * @protected
     * @override
     * @description Sets the default field name to 'packages' for YAML files
     */
    _init() {
        var _a, _b;
        // @ts-ignore
        this.field = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.field) !== null && _b !== void 0 ? _b : 'packages';
    }
    /**
     * Gets the JSON representation of the YAML content
     *
     * @override
     * @type {IJsonObject<K>}
     * @returns {IJsonObject<K>} The parsed YAML as JSON object / 2.0
     */
    // @ts-ignore
    get json() {
        var _a;
        return (_a = this[SymRaw]) === null || _a === void 0 ? void 0 : _a.json;
    }
    /**
     * Sets the JSON content and updates the YAML representation
     *
     * @override
     * @param {IJsonObject<K>} json - The JSON object to set / 2.0
     */
    set json(json) {
        this[SymRaw].json = json;
    }
    /**
     * Gets the scope array from the YAML content
     *
     * @override
     * @type {string[] | undefined}
     * @returns {string[] | undefined} The scope array or undefined / 2.0
     */
    get value() {
        var _a;
        return (_a = this.json) === null || _a === void 0 ? void 0 : _a[this.field];
    }
    /**
     * Sets the scope array in the YAML content
     *
     * @override
     * @param {string[]} value - New scope array value / 2.0
     */
    set value(value) {
        const json = this.json;
        json[this.field] = value;
        this.json = json;
    }
    /**
     * Checks if the YAML file exists on disk
     *
     * @returns {boolean} True if file exists / 2.0
     */
    existsFile() {
        return (0, fs_extra_1.pathExistsSync)(this.file);
    }
    /**
     * Checks if the YAML file has been loaded
     *
     * @override
     * @readonly
     * @type {boolean}
     * @returns {boolean} True if YAWN instance exists / 2.0
     */
    get opened() {
        return !!this[SymRaw];
    }
    /**
     * Loads the YAML file content into memory
     *
     * @param {boolean} [reload] - Force reload even if already loaded / 2.0
     * @returns {IJsonObject<K>} The parsed YAML as JSON object / 2.0
     */
    loadFile(reload) {
        if (reload || !this.opened) {
            let input = (0, fs_extra_1.readFileSync)(this.file).toString();
            let raw = new yawn_yaml_1.default(input);
            this[SymRaw] = raw;
        }
        return this.json;
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
    saveFile() {
        if (this.opened) {
            (0, fs_extra_1.writeFileSync)(this.file, this[SymRaw].yaml);
        }
    }
    /**
     * Loads the YAML file only if it exists
     *
     * @param {boolean} [reload] - Force reload even if already loaded / 2.0
     * @returns {IJsonObject<K>|false} The parsed YAML or false if file doesn't exist / 2.0
     */
    loadFileLazy(reload) {
        return this.existsFile() && this.loadFile(reload);
    }
}
exports.ScopeYaml = ScopeYaml;
//# sourceMappingURL=yaml.js.map