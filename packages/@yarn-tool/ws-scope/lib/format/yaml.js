"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeYaml = exports.SymRaw = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const json_object_1 = require("./json-object");
const cjs_1 = tslib_1.__importDefault(require("yawn-yaml/cjs"));
const SymRaw = Symbol.for('raw');
exports.SymRaw = SymRaw;
class ScopeYaml extends json_object_1.ScopeJsonObject {
    _init() {
        var _a, _b;
        // @ts-ignore
        this.field = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.field) !== null && _b !== void 0 ? _b : 'packages';
    }
    // @ts-ignore
    get json() {
        var _a;
        return (_a = this[SymRaw]) === null || _a === void 0 ? void 0 : _a.json;
    }
    set json(json) {
        this[SymRaw].json = json;
    }
    existsFile() {
        return (0, fs_extra_1.pathExistsSync)(this.file);
    }
    get opened() {
        return !!this[SymRaw];
    }
    loadFile(reload) {
        if (reload || !this.opened) {
            let input = (0, fs_extra_1.readFileSync)(this.file).toString();
            let raw = new cjs_1.default(input);
            this[SymRaw] = raw;
        }
        return this.json;
    }
    saveFile() {
        if (this.opened) {
            (0, fs_extra_1.writeFileSync)(this.file, this[SymRaw].yaml);
        }
    }
    loadFileLazy(reload) {
        return this.existsFile() && this.loadFile(reload);
    }
}
exports.ScopeYaml = ScopeYaml;
//# sourceMappingURL=yaml.js.map