"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageJsonLoader = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = require("fs-extra");
const sort_package_json3_1 = require("sort-package-json3");
const bind_decorator_1 = tslib_1.__importDefault(require("bind-decorator"));
const path_1 = tslib_1.__importDefault(require("path"));
const resolve_package_1 = require("@yarn-tool/resolve-package");
const exports_1 = require("@yarn-tool/pkg-entry-util/lib/field/exports");
const fs_json_1 = require("@bluelovers/fs-json");
const publishConfig_1 = require("@yarn-tool/pkg-entry-util/lib/field/publishConfig");
const bin_1 = require("@yarn-tool/pkg-entry-util/lib/field/bin");
class PackageJsonLoader {
    constructor(fileOrJson, ...argv) {
        this._use = [];
        if (typeof fileOrJson === 'string') {
            this.setFilename(fileOrJson);
        }
        else if (Buffer.isBuffer(fileOrJson)) {
            this.setJson(JSON.parse(fileOrJson.toString()));
        }
        else if (typeof fileOrJson === 'object') {
            this.setJson(JSON.parse(fileOrJson.toString()));
        }
        else if (fileOrJson != null) {
            throw new TypeError(`fileOrJson is not valid`);
        }
    }
    static create(file, ...argv) {
        return new this(file, ...argv);
    }
    static createByJson(json, ...argv) {
        return new this(json, ...argv);
    }
    static findPackageJsonPath(name) {
        return (0, resolve_package_1.resolvePackageJsonLocation)(name);
    }
    static loadByModuleName(name) {
        let file = this.findPackageJsonPath(name);
        let pkg = this.create(file);
        if (pkg.data.name !== name) {
            throw new TypeError(`package name not match, '${pkg.data.name}' != '${name}'`);
        }
        return pkg;
    }
    use(ls) {
        if (Array.isArray(ls)) {
            this._use.push(...ls);
        }
        else {
            this._use.push(ls);
        }
    }
    setFilename(file) {
        // @ts-ignore
        this.file = file;
        return this;
    }
    setJson(json) {
        this.loaded = true;
        this.json = json;
        return this;
    }
    read(reload) {
        if (!this.loaded || reload) {
            this.json = (0, fs_json_1.readJSONSync)(this.file);
        }
        this.loaded = true;
        return this;
    }
    reload() {
        return this.read(true);
    }
    get dir() {
        return path_1.default.dirname(this.file);
    }
    /**
     * skip typescript type check
     */
    get unsafeTypeData() {
        return this.data;
    }
    /**
     * skip typescript type check
     */
    set unsafeTypeData(json) {
        this.data = json;
    }
    set data(json) {
        this.overwrite(json);
    }
    get data() {
        if (!this.loaded && this.file) {
            this.read();
        }
        return this.json;
    }
    overwrite(json) {
        this.loaded = true;
        this.json = json;
        return this;
    }
    autofix() {
        var _a;
        let self = this;
        let dir;
        if (self.file && (0, fs_extra_1.pathExistsSync)(dir = self.dir)) {
            if (self.data) {
                (0, bin_1.fixPkgBinField)(self.data, dir);
                (0, publishConfig_1.fixPublishConfig)(self.data);
            }
        }
        (0, exports_1._pkgExportsAddPJsonEntryCore)((_a = self.data) === null || _a === void 0 ? void 0 : _a.exports);
    }
    run(options = {}) {
        if (options.autofix == null || options.autofix) {
            this.autofix();
        }
        this._use.forEach(fn => fn.call(this, this.data));
        return this;
    }
    exists() {
        return (0, fs_extra_1.pathExistsSync)(this.file);
    }
    stringify() {
        return JSON.stringify(this.json, null, 2);
    }
    sort() {
        if (typeof this.data === 'undefined' || this.data === null) {
            throw new Error(`data is undefined`);
        }
        this.data = (0, sort_package_json3_1.sortPackageJson)(this.data);
        return this;
    }
    write() {
        if (!this.file) {
            throw new Error(`file is undefined`);
        }
        (0, fs_extra_1.writeFileSync)(this.file, this.stringify() + '\n');
        return this;
    }
    writeOnlyWhenLoaded() {
        if (this.loaded) {
            this.write();
        }
        return this.loaded;
    }
}
tslib_1.__decorate([
    bind_decorator_1.default,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], PackageJsonLoader, "create", null);
tslib_1.__decorate([
    bind_decorator_1.default,
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], PackageJsonLoader, "loadByModuleName", null);
exports.PackageJsonLoader = PackageJsonLoader;
exports.default = PackageJsonLoader;
//# sourceMappingURL=index.js.map