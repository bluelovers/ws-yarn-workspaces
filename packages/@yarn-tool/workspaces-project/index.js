"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _internal;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspacesProject = void 0;
const project_1 = __importDefault(require("@lerna/project"));
const upath2_1 = require("upath2");
const core_1 = __importDefault(require("find-yarn-workspace-root2/core"));
const util_1 = require("./lib/util");
const lodash_1 = require("lodash");
const sort_object_keys2_1 = __importDefault(require("sort-object-keys2"));
class WorkspacesProject {
    constructor(cwd, options) {
        _internal.set(this, {});
        cwd = upath2_1.resolve(cwd || process.cwd());
        let root = core_1.default(cwd);
        this._project = new project_1.default(cwd);
        let rootPath = this._project.rootPath;
        switch (util_1.checkPaths({
            root,
            rootPath,
        }, options)) {
            case 1 /* root */:
                this._project = new project_1.default(root);
                break;
            case -1 /* failed */:
                throw new Error(`lerna root is not match yarn workspaces root.\ncwd: ${cwd}\nyarn: ${root}\nlerna: ${rootPath}`);
                break;
        }
        this._project.rootPath = upath2_1.normalize(this._project.rootPath);
        this._project.rootConfigLocation = upath2_1.normalize(this._project.rootConfigLocation);
    }
    _hasInternal(field) {
        return field in __classPrivateFieldGet(this, _internal);
    }
    _getInternal(field) {
        return __classPrivateFieldGet(this, _internal)[field];
    }
    _setInternal(field, value) {
        return __classPrivateFieldGet(this, _internal)[field] = value;
    }
    get rootPath() {
        return this._project.rootPath;
    }
    get lernaConfigLocation() {
        return this._project.rootConfigLocation;
    }
    get npmClient() {
        return this._project.config.npmClient;
    }
    set npmClient(value) {
        this._project.config.npmClient = value;
    }
    get workspaces() {
        let ws;
        if (this._hasInternal('workspaces')) {
            ws = this._getInternal('workspaces');
        }
        else {
            try {
                ws = this._project.packageConfigs;
            }
            catch (e) {
            }
            if (!(ws === null || ws === void 0 ? void 0 : ws.length)) {
                ws = ["packages/*" /* workspace */];
            }
            this._setInternal('workspaces', ws);
        }
        return ws;
    }
    get defaultWorkspace() {
        if (this._hasInternal('defaultWorkspace')) {
            return this._getInternal('defaultWorkspace');
        }
        if (this.workspaces.includes("packages/*" /* workspace */)) {
            return "packages/*" /* workspace */;
        }
        return this.workspaces[0];
    }
    set defaultWorkspace(value) {
        if (!this.workspaces.includes(value)) {
            throw new RangeError(`${value} not exists in ${this.workspaces}`);
        }
        __classPrivateFieldGet(this, _internal).defaultWorkspace = value;
    }
    isIndependent() {
        return this.version === "independent" /* independent */;
    }
    get version() {
        var _a;
        return (_a = this._project.config.version) !== null && _a !== void 0 ? _a : "independent" /* independent */;
    }
    set version(val) {
        this._project.config.version = val;
    }
    /**
     * @see https://github.com/lerna/lerna/tree/master/core/package
     */
    get manifest() {
        return this._project.manifest;
    }
    get config() {
        let ws = this.workspaces;
        if ('workspaces' in this._project.config) {
            this._project.config.workspaces = ws;
        }
        else if ('packages' in this._project.config || 1) {
            this._project.config.packages = ws;
        }
        this._project.config.version = this.version;
        let w = this.defaultWorkspace;
        if (ws[0] !== w) {
            let i = ws.indexOf(w);
            if (i !== -1) {
                ws.splice(i, 1);
                ws.unshift(w);
            }
        }
        return this._project.config;
    }
    get bump() {
        var _a, _b, _c;
        const command = this._project.config.command;
        return (_b = (_a = command === null || command === void 0 ? void 0 : command.publish) === null || _a === void 0 ? void 0 : _a.bump) !== null && _b !== void 0 ? _b : (_c = command === null || command === void 0 ? void 0 : command.version) === null || _c === void 0 ? void 0 : _c.bump;
    }
    get changelogPreset() {
        var _a, _b, _c;
        const command = this._project.config.command;
        return (_b = (_a = command === null || command === void 0 ? void 0 : command.version) === null || _a === void 0 ? void 0 : _a.changelogPreset) !== null && _b !== void 0 ? _b : (_c = command === null || command === void 0 ? void 0 : command.publish) === null || _c === void 0 ? void 0 : _c.changelogPreset;
    }
    get releaseConfig() {
        var _a, _b, _c;
        const command = this._project.config.command;
        __classPrivateFieldGet(this, _internal).releaseConfig = lodash_1.merge(__classPrivateFieldGet(this, _internal).releaseConfig, command === null || command === void 0 ? void 0 : command.version, command === null || command === void 0 ? void 0 : command.publish, {
            changelogPreset: this.changelogPreset,
            bump: this.bump,
            conventionalGraduate: (_b = (_a = command === null || command === void 0 ? void 0 : command.publish) === null || _a === void 0 ? void 0 : _a.conventionalGraduate) !== null && _b !== void 0 ? _b : (_c = command === null || command === void 0 ? void 0 : command.version) === null || _c === void 0 ? void 0 : _c.conventionalGraduate,
        });
        __classPrivateFieldGet(this, _internal).releaseConfig = sort_object_keys2_1.default(__classPrivateFieldGet(this, _internal).releaseConfig);
        return __classPrivateFieldGet(this, _internal).releaseConfig;
    }
}
exports.WorkspacesProject = WorkspacesProject;
_internal = new WeakMap();
exports.default = WorkspacesProject;
//# sourceMappingURL=index.js.map