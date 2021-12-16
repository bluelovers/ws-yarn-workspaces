"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryDepsValueByNpa = exports.queryDepsValueByNpaResult = void 0;
const tslib_1 = require("tslib");
const npa_to_deps_1 = tslib_1.__importDefault(require("@yarn-tool/npa-to-deps"));
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
function queryDepsValueByNpaResult(depsResult, options) {
    return bluebird_1.default.resolve(depsResult)
        .then(depsResult => {
        var _a, _b;
        const name = depsResult.name;
        const operator = (_a = depsResult.operator) !== null && _a !== void 0 ? _a : '';
        if (depsResult.fetchQuery) {
            return (0, queryVersion_1.queryVersionWithCache)(depsResult.name, (_b = depsResult.semver) !== null && _b !== void 0 ? _b : depsResult.result.fetchSpec, options === null || options === void 0 ? void 0 : options.queryOptions)
                .then(version => {
                return {
                    name,
                    value: `${operator}${version}`,
                };
            });
        }
        return {
            name,
            value: `${operator}${depsResult.semver}`,
        };
    });
}
exports.queryDepsValueByNpaResult = queryDepsValueByNpaResult;
function queryDepsValueByNpa(input, options) {
    return bluebird_1.default.resolve()
        .then(() => {
        return (0, npa_to_deps_1.default)(input, options);
    })
        .then((result) => {
        return queryDepsValueByNpaResult(result, options)
            .then((ret) => {
            return {
                ...result,
                ...ret,
            };
        });
    });
}
exports.queryDepsValueByNpa = queryDepsValueByNpa;
exports.default = queryDepsValueByNpa;
//# sourceMappingURL=index.js.map