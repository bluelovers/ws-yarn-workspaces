"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs-extra"));
//import PACKAGE_JSON = require('./package.json');
const sort_package_json_1 = require("sort-package-json");
const pkg_up_1 = __importDefault(require("pkg-up"));
const bind_decorator_1 = __importDefault(require("bind-decorator"));
const util_1 = require("./util");
const path_1 = __importDefault(require("path"));
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
            this.json = fs.readJSONSync(this.file);
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
        if (self.file && fs.existsSync(dir = self.dir)) {
            if (self.data) {
                if (self.data.bin) {
                    if (typeof self.data.bin === 'string') {
                        let bin_new = util_1.fixBinPath(self.data.bin, dir);
                        if (bin_new) {
                            self.data.bin = bin_new;
                        }
                    }
                    else if (typeof self.data.bin === 'object' && !Array.isArray(self.data.bin)) {
                        Object.keys(self.data.bin)
                            .forEach(function (key) {
                            if (typeof self.data.bin[key] === 'string') {
                                let bin_new = util_1.fixBinPath(self.data.bin[key], dir);
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
        return fs.existsSync(this.file);
    }
    stringify() {
        return JSON.stringify(this.json, null, 2);
    }
    sort() {
        if (typeof this.data === 'undefined' || this.data === null) {
            throw new Error(`data is undefined`);
        }
        this.data = sort_package_json_1.sortPackageJson(this.data);
        return this;
    }
    write() {
        if (!this.file) {
            throw new Error(`file is undefined`);
        }
        fs.writeFileSync(this.file, this.stringify());
        return this;
    }
    writeOnlyWhenLoaded() {
        if (this.loaded) {
            this.write();
        }
        return this.loaded;
    }
}
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PackageJsonLoader, "create", null);
__decorate([
    bind_decorator_1.default,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PackageJsonLoader, "loadByModuleName", null);
exports.PackageJsonLoader = PackageJsonLoader;
exports.default = PackageJsonLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBK0I7QUFDL0Isa0RBQWtEO0FBQ2xELHlEQUFvRDtBQUNwRCxvREFBMkI7QUFDM0Isb0VBQWtDO0FBQ2xDLGlDQUFvQztBQUNwQyxnREFBd0I7QUFheEIsTUFBYSxpQkFBaUI7SUF5QzdCLFlBQVksVUFBdUIsRUFBRSxHQUFHLElBQUk7UUFuQ2xDLFNBQUksR0FBNEMsRUFBRSxDQUFDO1FBcUM1RCxJQUFJLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFDbEM7WUFDQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFBO1NBQzVCO2FBQ0ksSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxFQUNwQztZQUNDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFBO1NBQy9DO2FBQ0ksSUFBSSxPQUFPLFVBQVUsS0FBSyxRQUFRLEVBQ3ZDO1lBQ0MsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUE7U0FDL0M7YUFDSSxJQUFJLFVBQVUsSUFBSSxJQUFJLEVBQzNCO1lBQ0MsTUFBTSxJQUFJLFNBQVMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1NBQzlDO0lBQ0YsQ0FBQztJQWxERCxNQUFNLENBQUMsTUFBTSxDQUFtQixJQUFpQixFQUFFLEdBQUcsSUFBSTtRQUV6RCxPQUFPLElBQUksSUFBSSxDQUFJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFBO0lBQ2xDLENBQUM7SUFFRCxNQUFNLENBQUMsWUFBWSxDQUFtQixJQUFPLEVBQUUsR0FBRyxJQUFJO1FBRXJELE9BQU8sSUFBSSxJQUFJLENBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUE7SUFDbEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFZO1FBRXRDLE9BQU8sZ0JBQUssQ0FBQyxJQUFJLENBQUM7WUFDakIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO1NBQzFCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFHRCxNQUFNLENBQUMsZ0JBQWdCLENBQW1CLElBQVk7UUFFckQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxDQUFDO1FBRTFDLElBQUksR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUksSUFBSSxDQUFDLENBQUM7UUFFL0IsSUFBSyxHQUFHLENBQUMsSUFBWSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQ25DO1lBQ0MsTUFBTSxJQUFJLFNBQVMsQ0FBQyw0QkFBNkIsR0FBRyxDQUFDLElBQVksQ0FBQyxJQUFJLFNBQVMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUN4RjtRQUVELE9BQU8sR0FBRyxDQUFDO0lBQ1osQ0FBQztJQXNCRCxHQUFHLENBQUMsRUFBeUQ7UUFFNUQsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUNyQjtZQUNDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7U0FDdEI7YUFFRDtZQUNDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ25CO0lBQ0YsQ0FBQztJQUVELFdBQVcsQ0FBQyxJQUFZO1FBRXZCLGFBQWE7UUFDYixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUVqQixPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxPQUFPLENBQUMsSUFBZ0I7UUFFdkIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFTLENBQUM7UUFFdEIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsSUFBSSxDQUFDLE1BQWdCO1FBRXBCLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxJQUFJLE1BQU0sRUFDMUI7WUFDQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZDO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFFbkIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsSUFBSSxHQUFHO1FBRU4sT0FBTyxjQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUMvQixDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLGNBQWM7UUFFakIsT0FBTyxJQUFJLENBQUMsSUFBVyxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7T0FFRztJQUNILElBQUksY0FBYyxDQUFDLElBQUk7UUFFdEIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFXLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksSUFBSSxDQUFDLElBQU87UUFFZixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RCLENBQUM7SUFFRCxJQUFJLElBQUk7UUFFUCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsSUFBSSxFQUM3QjtZQUNDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNaO1FBRUQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBZ0I7UUFFekIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFTLENBQUM7UUFFdEIsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsT0FBTztRQUVOLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFJLEdBQVcsQ0FBQztRQUVoQixJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUM5QztZQUNDLElBQUksSUFBSSxDQUFDLElBQUksRUFDYjtnQkFDQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUNqQjtvQkFDQyxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUssUUFBUSxFQUNyQzt3QkFDQyxJQUFJLE9BQU8sR0FBRyxpQkFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO3dCQUU3QyxJQUFJLE9BQU8sRUFDWDs0QkFDQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUM7eUJBQ3hCO3FCQUNEO3lCQUNJLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxRQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQzNFO3dCQUNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7NkJBQ3hCLE9BQU8sQ0FBQyxVQUFVLEdBQUc7NEJBRXJCLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsS0FBSyxRQUFRLEVBQzFDO2dDQUNDLElBQUksT0FBTyxHQUFHLGlCQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0NBRWxELElBQUksT0FBTyxFQUNYO29DQUNDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQztpQ0FDN0I7NkJBQ0Q7d0JBQ0YsQ0FBQyxDQUFDLENBQ0Y7cUJBQ0Q7aUJBQ0Q7Z0JBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYTt1QkFDeEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJO3VCQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7dUJBQ3pCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBRXRCO29CQUNDLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxHQUFHO3dCQUN6QixNQUFNLEVBQUUsUUFBUTtxQkFDaEIsQ0FBQztpQkFDRjthQUNEO1NBQ0Q7SUFDRixDQUFDO0lBRUQsR0FBRyxDQUFDLFVBRUEsRUFBRTtRQUVMLElBQUksT0FBTyxDQUFDLE9BQU8sSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLE9BQU8sRUFDOUM7WUFDQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDZjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFFbEQsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsTUFBTTtRQUVMLE9BQU8sRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDaEMsQ0FBQztJQUVELFNBQVM7UUFFUixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFDMUMsQ0FBQztJQUVELElBQUk7UUFFSCxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxJQUFJLEVBQzFEO1lBQ0MsTUFBTSxJQUFJLEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1NBQ3BDO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxtQ0FBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV2QyxPQUFPLElBQUksQ0FBQztJQUNiLENBQUM7SUFFRCxLQUFLO1FBRUosSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQ2Q7WUFDQyxNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixDQUFDLENBQUE7U0FDcEM7UUFFRCxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUM7UUFFOUMsT0FBTyxJQUFJLENBQUM7SUFDYixDQUFDO0lBRUQsbUJBQW1CO1FBRWxCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFDZjtZQUNDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNiO1FBRUQsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLENBQUM7Q0FDRDtBQXRQQTtJQURDLHdCQUFJOzs7O3FDQUlKO0FBZUQ7SUFEQyx3QkFBSTs7OzsrQ0FhSjtBQXZDRiw4Q0ErUEM7QUFPRCxrQkFBZSxpQkFBaUIsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzLWV4dHJhJztcbi8vaW1wb3J0IFBBQ0tBR0VfSlNPTiA9IHJlcXVpcmUoJy4vcGFja2FnZS5qc29uJyk7XG5pbXBvcnQgeyBzb3J0UGFja2FnZUpzb24gfSBmcm9tICdzb3J0LXBhY2thZ2UtanNvbic7XG5pbXBvcnQgcGtnVXAgZnJvbSAncGtnLXVwJztcbmltcG9ydCBiaW5kIGZyb20gJ2JpbmQtZGVjb3JhdG9yJztcbmltcG9ydCB7IGZpeEJpblBhdGggfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgeyBJUGFja2FnZUpzb24gfSBmcm9tICdAdHMtdHlwZS9wYWNrYWdlLWR0cyc7XG5pbXBvcnQgKiBhcyBUc1R5cGVQYWNrYWdlRHRzIGZyb20gJ0B0cy10eXBlL3BhY2thZ2UtZHRzJztcbmltcG9ydCB7IE9uY2UgfSBmcm9tICdsb2Rhc2gtZGVjb3JhdG9ycy9vbmNlJztcblxuZXhwb3J0IHsgSVBhY2thZ2VKc29uIH1cblxudHlwZSBJRmlsZU9ySnNvbiA9IEJ1ZmZlciB8IHN0cmluZyB8IG9iamVjdCB8IElQYWNrYWdlSnNvblxuXG50eXBlIElQYWNrYWdlSnNvbkxpa2U8VD4gPSBQYXJ0aWFsPFQ+IHwgUmVjb3JkPHN0cmluZywgYW55PjtcblxudHlwZSBJSXRlbU9ySXRlbUFycmF5PFQ+ID0gVCB8IFRbXTtcblxuZXhwb3J0IGNsYXNzIFBhY2thZ2VKc29uTG9hZGVyPFQgZXh0ZW5kcyBJUGFja2FnZUpzb25MaWtlPElQYWNrYWdlSnNvbj4gPSBJUGFja2FnZUpzb24+XG57XG5cdHJlYWRvbmx5IGZpbGU6IHN0cmluZztcblx0cHJvdGVjdGVkIGpzb246IFQ7XG5cdGxvYWRlZDogYm9vbGVhbjtcblxuXHRwcm90ZWN0ZWQgX3VzZTogKChqc29uOiBJUGFja2FnZUpzb25MaWtlPFQ+KSA9PiB2b2lkKVtdID0gW107XG5cblx0QGJpbmRcblx0c3RhdGljIGNyZWF0ZTxUID0gSVBhY2thZ2VKc29uPihmaWxlOiBJRmlsZU9ySnNvbiwgLi4uYXJndilcblx0e1xuXHRcdHJldHVybiBuZXcgdGhpczxUPihmaWxlLCAuLi5hcmd2KVxuXHR9XG5cblx0c3RhdGljIGNyZWF0ZUJ5SnNvbjxUID0gSVBhY2thZ2VKc29uPihqc29uOiBULCAuLi5hcmd2KVxuXHR7XG5cdFx0cmV0dXJuIG5ldyB0aGlzPFQ+KGpzb24sIC4uLmFyZ3YpXG5cdH1cblxuXHRzdGF0aWMgZmluZFBhY2thZ2VKc29uUGF0aChuYW1lOiBzdHJpbmcpOiBzdHJpbmdcblx0e1xuXHRcdHJldHVybiBwa2dVcC5zeW5jKHtcblx0XHRcdGN3ZDogcmVxdWlyZS5yZXNvbHZlKG5hbWUpLFxuXHRcdH0pO1xuXHR9XG5cblx0QGJpbmRcblx0c3RhdGljIGxvYWRCeU1vZHVsZU5hbWU8VCA9IElQYWNrYWdlSnNvbj4obmFtZTogc3RyaW5nKVxuXHR7XG5cdFx0bGV0IGZpbGUgPSB0aGlzLmZpbmRQYWNrYWdlSnNvblBhdGgobmFtZSk7XG5cblx0XHRsZXQgcGtnID0gdGhpcy5jcmVhdGU8VD4oZmlsZSk7XG5cblx0XHRpZiAoKHBrZy5kYXRhIGFzIGFueSkubmFtZSAhPT0gbmFtZSlcblx0XHR7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKGBwYWNrYWdlIG5hbWUgbm90IG1hdGNoLCAnJHsocGtnLmRhdGEgYXMgYW55KS5uYW1lfScgIT0gJyR7bmFtZX0nYCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBrZztcblx0fVxuXG5cdGNvbnN0cnVjdG9yKGZpbGVPckpzb246IElGaWxlT3JKc29uLCAuLi5hcmd2KVxuXHR7XG5cdFx0aWYgKHR5cGVvZiBmaWxlT3JKc29uID09PSAnc3RyaW5nJylcblx0XHR7XG5cdFx0XHR0aGlzLnNldEZpbGVuYW1lKGZpbGVPckpzb24pXG5cdFx0fVxuXHRcdGVsc2UgaWYgKEJ1ZmZlci5pc0J1ZmZlcihmaWxlT3JKc29uKSlcblx0XHR7XG5cdFx0XHR0aGlzLnNldEpzb24oSlNPTi5wYXJzZShmaWxlT3JKc29uLnRvU3RyaW5nKCkpKVxuXHRcdH1cblx0XHRlbHNlIGlmICh0eXBlb2YgZmlsZU9ySnNvbiA9PT0gJ29iamVjdCcpXG5cdFx0e1xuXHRcdFx0dGhpcy5zZXRKc29uKEpTT04ucGFyc2UoZmlsZU9ySnNvbi50b1N0cmluZygpKSlcblx0XHR9XG5cdFx0ZWxzZSBpZiAoZmlsZU9ySnNvbiAhPSBudWxsKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBUeXBlRXJyb3IoYGZpbGVPckpzb24gaXMgbm90IHZhbGlkYClcblx0XHR9XG5cdH1cblxuXHR1c2UobHM6IElJdGVtT3JJdGVtQXJyYXk8KGpzb246IElQYWNrYWdlSnNvbkxpa2U8VD4pID0+IHZvaWQ+KVxuXHR7XG5cdFx0aWYgKEFycmF5LmlzQXJyYXkobHMpKVxuXHRcdHtcblx0XHRcdHRoaXMuX3VzZS5wdXNoKC4uLmxzKTtcblx0XHR9XG5cdFx0ZWxzZVxuXHRcdHtcblx0XHRcdHRoaXMuX3VzZS5wdXNoKGxzKTtcblx0XHR9XG5cdH1cblxuXHRzZXRGaWxlbmFtZShmaWxlOiBzdHJpbmcpXG5cdHtcblx0XHQvLyBAdHMtaWdub3JlXG5cdFx0dGhpcy5maWxlID0gZmlsZTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0c2V0SnNvbihqc29uOiBvYmplY3QgfCBUKVxuXHR7XG5cdFx0dGhpcy5sb2FkZWQgPSB0cnVlO1xuXHRcdHRoaXMuanNvbiA9IGpzb24gYXMgVDtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0cmVhZChyZWxvYWQ/OiBib29sZWFuKVxuXHR7XG5cdFx0aWYgKCF0aGlzLmxvYWRlZCB8fCByZWxvYWQpXG5cdFx0e1xuXHRcdFx0dGhpcy5qc29uID0gZnMucmVhZEpTT05TeW5jKHRoaXMuZmlsZSk7XG5cdFx0fVxuXG5cdFx0dGhpcy5sb2FkZWQgPSB0cnVlO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRnZXQgZGlyKClcblx0e1xuXHRcdHJldHVybiBwYXRoLmRpcm5hbWUodGhpcy5maWxlKVxuXHR9XG5cblx0LyoqXG5cdCAqIHNraXAgdHlwZXNjcmlwdCB0eXBlIGNoZWNrXG5cdCAqL1xuXHRnZXQgdW5zYWZlVHlwZURhdGEoKTogSVBhY2thZ2VKc29uTGlrZTxUPlxuXHR7XG5cdFx0cmV0dXJuIHRoaXMuZGF0YSBhcyBhbnk7XG5cdH1cblxuXHQvKipcblx0ICogc2tpcCB0eXBlc2NyaXB0IHR5cGUgY2hlY2tcblx0ICovXG5cdHNldCB1bnNhZmVUeXBlRGF0YShqc29uKVxuXHR7XG5cdFx0dGhpcy5kYXRhID0ganNvbiBhcyBhbnk7XG5cdH1cblxuXHRzZXQgZGF0YShqc29uOiBUKVxuXHR7XG5cdFx0dGhpcy5vdmVyd3JpdGUoanNvbik7XG5cdH1cblxuXHRnZXQgZGF0YSgpOiBUXG5cdHtcblx0XHRpZiAoIXRoaXMubG9hZGVkICYmIHRoaXMuZmlsZSlcblx0XHR7XG5cdFx0XHR0aGlzLnJlYWQoKTtcblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5qc29uO1xuXHR9XG5cblx0b3ZlcndyaXRlKGpzb246IG9iamVjdCB8IFQpXG5cdHtcblx0XHR0aGlzLmxvYWRlZCA9IHRydWU7XG5cdFx0dGhpcy5qc29uID0ganNvbiBhcyBUO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRhdXRvZml4KClcblx0e1xuXHRcdGxldCBzZWxmID0gdGhpcztcblx0XHRsZXQgZGlyOiBzdHJpbmc7XG5cblx0XHRpZiAoc2VsZi5maWxlICYmIGZzLmV4aXN0c1N5bmMoZGlyID0gc2VsZi5kaXIpKVxuXHRcdHtcblx0XHRcdGlmIChzZWxmLmRhdGEpXG5cdFx0XHR7XG5cdFx0XHRcdGlmIChzZWxmLmRhdGEuYmluKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0aWYgKHR5cGVvZiBzZWxmLmRhdGEuYmluID09PSAnc3RyaW5nJylcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRsZXQgYmluX25ldyA9IGZpeEJpblBhdGgoc2VsZi5kYXRhLmJpbiwgZGlyKTtcblxuXHRcdFx0XHRcdFx0aWYgKGJpbl9uZXcpXG5cdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdHNlbGYuZGF0YS5iaW4gPSBiaW5fbmV3O1xuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIGlmICh0eXBlb2Ygc2VsZi5kYXRhLmJpbiA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkoc2VsZi5kYXRhLmJpbikpXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0T2JqZWN0LmtleXMoc2VsZi5kYXRhLmJpbilcblx0XHRcdFx0XHRcdFx0LmZvckVhY2goZnVuY3Rpb24gKGtleSlcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygc2VsZi5kYXRhLmJpbltrZXldID09PSAnc3RyaW5nJylcblx0XHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0XHRsZXQgYmluX25ldyA9IGZpeEJpblBhdGgoc2VsZi5kYXRhLmJpbltrZXldLCBkaXIpO1xuXG5cdFx0XHRcdFx0XHRcdFx0XHRpZiAoYmluX25ldylcblx0XHRcdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0c2VsZi5kYXRhLmJpbltrZXldID0gYmluX25ldztcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdFx0XHQ7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCFzZWxmLmRhdGEucHVibGlzaENvbmZpZ1xuXHRcdFx0XHRcdCYmIHNlbGYuZGF0YS5uYW1lXG5cdFx0XHRcdFx0JiYgL1xcLy8udGVzdChzZWxmLmRhdGEubmFtZSlcblx0XHRcdFx0XHQmJiAhc2VsZi5kYXRhLnByaXZhdGVcblx0XHRcdFx0KVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0c2VsZi5kYXRhLnB1Ymxpc2hDb25maWcgPSB7XG5cdFx0XHRcdFx0XHRhY2Nlc3M6IFwicHVibGljXCIsXG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdHJ1bihvcHRpb25zOiB7XG5cdFx0YXV0b2ZpeD86IGJvb2xlYW5cblx0fSA9IHt9KVxuXHR7XG5cdFx0aWYgKG9wdGlvbnMuYXV0b2ZpeCA9PSBudWxsIHx8IG9wdGlvbnMuYXV0b2ZpeClcblx0XHR7XG5cdFx0XHR0aGlzLmF1dG9maXgoKTtcblx0XHR9XG5cblx0XHR0aGlzLl91c2UuZm9yRWFjaChmbiA9PiBmbi5jYWxsKHRoaXMsIHRoaXMuZGF0YSkpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRleGlzdHMoKVxuXHR7XG5cdFx0cmV0dXJuIGZzLmV4aXN0c1N5bmModGhpcy5maWxlKVxuXHR9XG5cblx0c3RyaW5naWZ5KClcblx0e1xuXHRcdHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLmpzb24sIG51bGwsIDIpXG5cdH1cblxuXHRzb3J0KClcblx0e1xuXHRcdGlmICh0eXBlb2YgdGhpcy5kYXRhID09PSAndW5kZWZpbmVkJyB8fCB0aGlzLmRhdGEgPT09IG51bGwpXG5cdFx0e1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBkYXRhIGlzIHVuZGVmaW5lZGApXG5cdFx0fVxuXG5cdFx0dGhpcy5kYXRhID0gc29ydFBhY2thZ2VKc29uKHRoaXMuZGF0YSk7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdHdyaXRlKClcblx0e1xuXHRcdGlmICghdGhpcy5maWxlKVxuXHRcdHtcblx0XHRcdHRocm93IG5ldyBFcnJvcihgZmlsZSBpcyB1bmRlZmluZWRgKVxuXHRcdH1cblxuXHRcdGZzLndyaXRlRmlsZVN5bmModGhpcy5maWxlLCB0aGlzLnN0cmluZ2lmeSgpKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0d3JpdGVPbmx5V2hlbkxvYWRlZCgpXG5cdHtcblx0XHRpZiAodGhpcy5sb2FkZWQpXG5cdFx0e1xuXHRcdFx0dGhpcy53cml0ZSgpO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmxvYWRlZDtcblx0fVxufVxuXG5leHBvcnQgZGVjbGFyZSBtb2R1bGUgUGFja2FnZUpzb25Mb2FkZXJcbntcblx0ZXhwb3J0IHR5cGUgSVBhY2thZ2VKc29uID0gVHNUeXBlUGFja2FnZUR0cy5JUGFja2FnZUpzb247XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBhY2thZ2VKc29uTG9hZGVyXG4iXX0=