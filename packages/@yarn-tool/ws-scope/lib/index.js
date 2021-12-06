"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesScope = void 0;
const find_root_1 = require("@yarn-tool/find-root");
const upath2_1 = require("upath2");
const json_1 = require("./format/json");
const yaml_1 = require("./format/yaml");
const array_hyper_unique_1 = require("array-hyper-unique");
const check_scope_1 = require("./util/check-scope");
const upath2_2 = require("upath2");
class WorkspacesScope {
    constructor(cwd) {
        this.rootData = (0, find_root_1.findRootLazy)({
            cwd,
            throwError: true,
            shouldHasWorkspaces: true,
        });
        this._root_package_json = new json_1.ScopeJson(this.resolvePath('package.json'), {
            field: 'workspaces',
        });
        this._root_lerna_json = new json_1.ScopeJson(this.resolvePath('lerna.json'), {
            field: 'packages',
        });
        this._root_pnpm_workspace_yaml = new yaml_1.ScopeYaml(this.resolvePath('pnpm-workspace.yaml'), {
            field: 'packages',
        });
        this._root_package_json.existsFile() && this._root_package_json.loadFile();
        this._root_lerna_json.existsFile() && this._root_lerna_json.loadFile();
        this._root_pnpm_workspace_yaml.existsFile() && this._root_pnpm_workspace_yaml.loadFile();
    }
    get changed() {
        return this._root_package_json.changed || this._root_lerna_json.changed || this._root_pnpm_workspace_yaml.changed;
    }
    resolvePath(...paths) {
        if (!paths.length) {
            throw new SyntaxError(`Invalid arguments: ${paths}`);
        }
        return (0, upath2_1.resolve)(this.rootData.ws, ...paths);
    }
    add(scope) {
        if (scope === (0, upath2_2.basename)(scope)) {
            scope = `packages/${scope}/*`;
        }
        (0, check_scope_1.assertScopePath)(scope, this.rootData.ws);
        this._root_package_json.add(scope);
        this._root_lerna_json.add(scope);
        this._root_pnpm_workspace_yaml.add(scope);
        return scope;
    }
    remove(scope) {
        if (scope === (0, upath2_2.basename)(scope)) {
            scope = `packages/${scope}/*`;
        }
        (0, check_scope_1.assertScopePath)(scope, this.rootData.ws);
        this._root_package_json.remove(scope);
        this._root_lerna_json.remove(scope);
        this._root_pnpm_workspace_yaml.remove(scope);
        return scope;
    }
    save() {
        this._root_package_json.saveFile();
        this._root_lerna_json.saveFile();
        this._root_pnpm_workspace_yaml.saveFile();
    }
    get value() {
        const value = [
            this._root_package_json.value,
            this._root_lerna_json.value,
            this._root_pnpm_workspace_yaml.value,
        ].flat().filter(v => v === null || v === void 0 ? void 0 : v.length);
        return (0, array_hyper_unique_1.array_unique_overwrite)(value);
    }
    syncValue() {
        const value = this.value
            .filter(v => (v === null || v === void 0 ? void 0 : v.length) && !v.startsWith('!'));
        (0, array_hyper_unique_1.array_unique_overwrite)(value);
        value.forEach(scope => this.add(scope));
        return value;
    }
}
exports.WorkspacesScope = WorkspacesScope;
exports.default = WorkspacesScope;
//# sourceMappingURL=index.js.map