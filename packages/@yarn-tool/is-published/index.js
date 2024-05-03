"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumIsPublishedState = void 0;
exports._isPublishedCoreByNpaResult = _isPublishedCoreByNpaResult;
exports._isPublishedCore = _isPublishedCore;
exports._isPublishedCoreByPackageJSON = _isPublishedCoreByPackageJSON;
exports.isPublishedByNpaResult = isPublishedByNpaResult;
exports.isPublished = isPublished;
exports.isPublishedByPackageJSON = isPublishedByPackageJSON;
const tslib_1 = require("tslib");
const npa_to_deps_query_1 = require("@yarn-tool/npa-to-deps-query");
const npa_to_deps_1 = require("@yarn-tool/npa-to-deps");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const package_json_1 = require("package-json");
var EnumIsPublishedState;
(function (EnumIsPublishedState) {
    EnumIsPublishedState[EnumIsPublishedState["VersionPublished"] = 0] = "VersionPublished";
    EnumIsPublishedState[EnumIsPublishedState["VersionNotFound"] = 1] = "VersionNotFound";
    EnumIsPublishedState[EnumIsPublishedState["PackageNotFound"] = 2] = "PackageNotFound";
})(EnumIsPublishedState || (exports.EnumIsPublishedState = EnumIsPublishedState = {}));
function _isPublishedCoreByNpaResult(depsResult, options) {
    return bluebird_1.default.resolve(depsResult)
        .then(depsResult => {
        return (0, npa_to_deps_query_1.queryDepsValueByNpaResult)({
            ...depsResult,
            operator: '',
            fetchQuery: true,
        }, options)
            .then((queryResult) => {
            const isPublished = depsResult.semver === queryResult.value;
            return {
                depsResult,
                queryResult,
                exists: true,
                isPublished,
                state: isPublished ? 0 /* EnumIsPublishedState.VersionPublished */ : 1 /* EnumIsPublishedState.VersionNotFound */,
            };
        })
            .catch(package_json_1.VersionNotFoundError, err => {
            return {
                depsResult,
                exists: true,
                isPublished: false,
                state: 1 /* EnumIsPublishedState.VersionNotFound */,
            };
        })
            .catch(package_json_1.PackageNotFoundError, err => {
            return {
                depsResult,
                exists: false,
                isPublished: null,
                state: 2 /* EnumIsPublishedState.PackageNotFound */,
            };
        });
    });
}
function _isPublishedCore(input, options) {
    return bluebird_1.default.resolve()
        .then(() => {
        return (0, npa_to_deps_1.npaToDepsValue)(input, options);
    })
        .then((result) => {
        return _isPublishedCoreByNpaResult(result, options);
    });
}
function _isPublishedCoreByPackageJSON(pkg, options) {
    return _isPublishedCore(`${pkg.name}@${pkg.version}`, options);
}
function isPublishedByNpaResult(depsResult, options) {
    return _isPublishedCoreByNpaResult(depsResult, options)
        .then(data => data === null || data === void 0 ? void 0 : data.isPublished);
}
function isPublished(input, options) {
    return _isPublishedCore(input, options)
        .then(data => data === null || data === void 0 ? void 0 : data.isPublished);
}
function isPublishedByPackageJSON(pkg, options) {
    return isPublished(`${pkg.name}@${pkg.version}`, options);
}
exports.default = isPublishedByPackageJSON;
//# sourceMappingURL=index.js.map