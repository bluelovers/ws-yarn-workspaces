"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScopeJsonObject = void 0;
const arrayAdd_1 = require("../util/arrayAdd");
class ScopeJsonObject {
    constructor(file, options) {
        this.file = file;
        this.options = options;
        this.changed = false;
        this._init();
    }
    _init() {
        var _a, _b;
        // @ts-ignore
        this.field = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.field) !== null && _b !== void 0 ? _b : 'workspaces';
    }
    get opened() {
        return !!this.json;
    }
    add(scope) {
        let { changed, value } = (0, arrayAdd_1.arrayAdd)(scope, this.value);
        this.value = value;
        this.changed || (this.changed = changed);
        return this.changed;
    }
    addLazy(scope) {
        return this.opened && this.add(scope);
    }
    remove(scope) {
        if (this.opened) {
            let { changed, value } = (0, arrayAdd_1.arrayRemove)(scope, this.value);
            this.value = value;
            this.changed || (this.changed = changed);
        }
        return this.changed;
    }
    removeLazy(scope) {
        return this.opened && this.remove(scope);
    }
    get value() {
        var _a;
        return (_a = this.json) === null || _a === void 0 ? void 0 : _a[this.field];
    }
    set value(value) {
        this.json[this.field] = value;
    }
}
exports.ScopeJsonObject = ScopeJsonObject;
//# sourceMappingURL=json-object.js.map