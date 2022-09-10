"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPublishedByPackageJSON = exports.isPublished = exports.isPublishedByNpaResult = exports._isPublishedCoreByPackageJSON = exports._isPublishedCore = exports._isPublishedCoreByNpaResult = exports.EnumIsPublishedState = void 0;
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
})(EnumIsPublishedState = exports.EnumIsPublishedState || (exports.EnumIsPublishedState = {}));
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
exports._isPublishedCoreByNpaResult = _isPublishedCoreByNpaResult;
function _isPublishedCore(input, options) {
    return bluebird_1.default.resolve()
        .then(() => {
        return (0, npa_to_deps_1.npaToDepsValue)(input, options);
    })
        .then((result) => {
        return _isPublishedCoreByNpaResult(result, options);
    });
}
exports._isPublishedCore = _isPublishedCore;
function _isPublishedCoreByPackageJSON(pkg, options) {
    return _isPublishedCore(`${pkg.name}@${pkg.version}`, options);
}
exports._isPublishedCoreByPackageJSON = _isPublishedCoreByPackageJSON;
function isPublishedByNpaResult(depsResult, options) {
    return _isPublishedCoreByNpaResult(depsResult, options)
        .then(data => data === null || data === void 0 ? void 0 : data.isPublished);
}
exports.isPublishedByNpaResult = isPublishedByNpaResult;
function isPublished(input, options) {
    return _isPublishedCore(input, options)
        .then(data => data === null || data === void 0 ? void 0 : data.isPublished);
}
exports.isPublished = isPublished;
function isPublishedByPackageJSON(pkg, options) {
    return isPublished(`${pkg.name}@${pkg.version}`, options);
}
exports.isPublishedByPackageJSON = isPublishedByPackageJSON;
exports.default = isPublishedByPackageJSON;
//# sourceMappingURL=index.js.map