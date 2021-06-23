"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitPackageTag = void 0;
const tslib_1 = require("tslib");
const core_1 = require("./core");
const tag_1 = require("@git-lazy/tag");
const path_is_same_1 = (0, tslib_1.__importDefault)(require("path-is-same"));
const find_root_1 = require("@yarn-tool/find-root");
const path_1 = require("path");
async function gitPackageTag(options, spawnOptions) {
    var _a, _b;
    let cwd = (_a = options === null || options === void 0 ? void 0 : options.cwd) !== null && _a !== void 0 ? _a : process.cwd();
    let rootData = (0, find_root_1.findRoot)({
        cwd,
    });
    if (rootData.hasWorkspace && rootData.isWorkspace) {
        throw new Error(`disallow create git tag for workspace root`);
    }
    else if (!(0, path_is_same_1.default)(rootData.pkg, cwd)) {
        throw new Error(`cwd must be same as package dir\n${rootData.pkg}\n${cwd}`);
    }
    if (!options.pkg) {
        options.pkg = await Promise.resolve().then(() => (0, tslib_1.__importStar)(require((0, path_1.join)(rootData.pkg, 'package.json')))).then(m => m.default || m);
    }
    cwd = options.cwd = rootData.pkg;
    options = (0, core_1.handleOptions)(options);
    const tag = (0, core_1.formatPackageTag)(options);
    options.message = (_b = options.message) !== null && _b !== void 0 ? _b : tag;
    spawnOptions = {
        ...spawnOptions,
        cwd,
    };
    return (0, tag_1.gitTag)(tag, options, spawnOptions);
}
exports.gitPackageTag = gitPackageTag;
exports.default = gitPackageTag;
//# sourceMappingURL=git-tag.js.map