"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitPackageTag = void 0;
const core_1 = require("./core");
const tag_1 = require("@git-lazy/tag");
const pkg_dir_1 = __importDefault(require("pkg-dir"));
const path_is_same_1 = __importDefault(require("path-is-same"));
async function gitPackageTag(options, spawnOptions) {
    var _a;
    options = core_1.handleOptions(options);
    if (!path_is_same_1.default(await pkg_dir_1.default(options.cwd), options.cwd)) {
        throw new Error(`cwd must be same as package dir`);
    }
    const tag = core_1.formatPackageTag(options);
    options.message = (_a = options.message) !== null && _a !== void 0 ? _a : tag;
    return tag_1.gitTag(tag, options, spawnOptions);
}
exports.gitPackageTag = gitPackageTag;
exports.default = gitPackageTag;
//# sourceMappingURL=git-tag.js.map