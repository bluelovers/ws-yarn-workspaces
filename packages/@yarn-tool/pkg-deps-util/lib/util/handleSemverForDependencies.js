"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSemverForDependencies = exports.isUpdateAbleVersion = exports.isUpdateAbleVersionByNpmPackageArgResult = void 0;
const tslib_1 = require("tslib");
const npm_package_arg_util_1 = tslib_1.__importDefault(require("@yarn-tool/npm-package-arg-util"));
const detect_1 = require("@yarn-tool/npm-package-arg-util/lib/detect");
const parseSimpleSemVerRange_1 = tslib_1.__importDefault(require("@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange"));
const checker_1 = require("@lazy-node/semver-simple-parse/lib/checker");
function isUpdateAbleVersionByNpmPackageArgResult(npaResult) {
    if ((0, detect_1.isRegistryResult)(npaResult) && npaResult.type !== 'tag') {
        return isUpdateAbleVersion(npaResult.fetchSpec);
    }
}
exports.isUpdateAbleVersionByNpmPackageArgResult = isUpdateAbleVersionByNpmPackageArgResult;
function isUpdateAbleVersion(version) {
    const list = (0, parseSimpleSemVerRange_1.default)(version);
    if (list.length === 1) {
        let semver = list[0];
        if ((0, checker_1.isSimpleSemVerObjectLike)(semver)) {
            return semver;
        }
    }
}
exports.isUpdateAbleVersion = isUpdateAbleVersion;
function handleSemverForDependencies(packageName) {
    const result = (0, npm_package_arg_util_1.default)(packageName);
    return isUpdateAbleVersionByNpmPackageArgResult(result);
}
exports.handleSemverForDependencies = handleSemverForDependencies;
//# sourceMappingURL=handleSemverForDependencies.js.map