"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageJsonLoader = void 0;
const tslib_1 = require("tslib");
const fs_extra_1 = (0, tslib_1.__importDefault)(require("fs-extra"));
const sort_package_json3_1 = (0, tslib_1.__importDefault)(require("sort-package-json3"));
const pkg_up_1 = (0, tslib_1.__importDefault)(require("pkg-up"));
const bind_decorator_1 = (0, tslib_1.__importDefault)(require("bind-decorator"));
const util_1 = require("./util");
const path_1 = (0, tslib_1.__importDefault)(require("path"));
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
        return pkg_up_1.default.sync({
            cwd: require.resolve(name),
        });
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
            this.json = fs_extra_1.default.readJSONSync(this.file);
        }
        this.loaded = true;
        return this;
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
        let self = this;
        let dir;
        if (self.file && fs_extra_1.default.existsSync(dir = self.dir)) {
            if (self.data) {
                if (self.data.bin) {
                    if (typeof self.data.bin === 'string') {
                        let bin_new = (0, util_1.fixBinPath)(self.data.bin, dir);
                        if (bin_new) {
                            // @ts-ignore
                            self.data.bin = bin_new;
                        }
                    }
                    else if (typeof self.data.bin === 'object' && !Array.isArray(self.data.bin)) {
                        Object.keys(self.data.bin)
                            .forEach(function (key) {
                            if (typeof self.data.bin[key] === 'string') {
                                let bin_new = (0, util_1.fixBinPath)(self.data.bin[key], dir);
                                if (bin_new) {
                                    self.data.bin[key] = bin_new;
                                }
                            }
                        });
                    }
                }
                if (!self.data.publishConfig
                    && self.data.name
                    && /\//.test(self.data.name)
                    && !self.data.private) {
                    self.data.publishConfig = {
                        access: "public",
                    };
                }
            }
        }
    }
    run(options = {}) {
        if (options.autofix == null || options.autofix) {
            this.autofix();
        }
        this._use.forEach(fn => fn.call(this, this.data));
        return this;
    }
    exists() {
        return fs_extra_1.default.existsSync(this.file);
    }
    stringify() {
        return JSON.stringify(this.json, null, 2);
    }
    sort() {
        if (typeof this.data === 'undefined' || this.data === null) {
            throw new Error(`data is undefined`);
        }
        this.data = (0, sort_package_json3_1.default)(this.data);
        return this;
    }
    write() {
        if (!this.file) {
            throw new Error(`file is undefined`);
        }
        fs_extra_1.default.writeFileSync(this.file, this.stringify());
        return this;
    }
    writeOnlyWhenLoaded() {
        if (this.loaded) {
            this.write();
        }
        return this.loaded;
    }
}
(0, tslib_1.__decorate)([
    bind_decorator_1.default,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [Object, Object]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], PackageJsonLoader, "create", null);
(0, tslib_1.__decorate)([
    bind_decorator_1.default,
    (0, tslib_1.__metadata)("design:type", Function),
    (0, tslib_1.__metadata)("design:paramtypes", [String]),
    (0, tslib_1.__metadata)("design:returntype", void 0)
], PackageJsonLoader, "loadByModuleName", null);
exports.PackageJsonLoader = PackageJsonLoader;
exports.default = PackageJsonLoader;
//# sourceMappingURL=index.js.map