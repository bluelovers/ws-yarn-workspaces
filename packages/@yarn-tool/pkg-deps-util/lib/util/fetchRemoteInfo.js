"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchRemoteInfo = void 0;
const tslib_1 = require("tslib");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const parseArgvPkgName_1 = require("@yarn-tool/npm-package-arg-util/lib/parseArgvPkgName");
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
function fetchRemoteInfo(packageNames, options = {}) {
    return bluebird_1.default.resolve(packageNames)
        .reduce(async (data, input) => {
        const result = (0, parseArgvPkgName_1.parsePackageName)(input);
        const versionQuery = await (0, queryVersion_1.queryVersionWithCache)(result.name, result.semver, options.queryOptions);
        // @ts-ignore
        data[result.name] = {
            ...result,
            versionQuery,
        };
        return data;
    }, {});
}
exports.fetchRemoteInfo = fetchRemoteInfo;
//# sourceMappingURL=fetchRemoteInfo.js.map