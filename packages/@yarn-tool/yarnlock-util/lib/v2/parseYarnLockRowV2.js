"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseYarnLockRowV2 = void 0;
const parsers_1 = require("@yarnpkg/parsers");
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const getSemverFromNpaResult_1 = require("@yarn-tool/npm-package-arg-util/lib/getSemverFromNpaResult");
function parseYarnLockRowV2(packageName, packageData) {
    var _a, _b;
    let ret = (0, parsers_1.parseResolution)(packageData.resolution);
    let name = (_a = ret === null || ret === void 0 ? void 0 : ret.descriptor) === null || _a === void 0 ? void 0 : _a.fullName;
    let version = (_b = ret === null || ret === void 0 ? void 0 : ret.descriptor) === null || _b === void 0 ? void 0 : _b.description;
    if (name) {
        version = version.replace(/^(npm):/, '');
        if (!version.length) {
            version = ret.descriptor.description;
        }
        let parsed;
        let semver;
        try {
            /**
             * @fixme support packageName: 'once@npm:^1.3.1, once@npm:^1.4.0'
             */
            parsed = (0, npm_package_arg_util_1.npa)(packageName);
            semver = (0, getSemverFromNpaResult_1.getSemverFromNpaResult)(parsed);
        }
        catch (e) {
            /*
            console.dir({
                name,
                version,
            })
            console.dir({
                packageName,
                packageData,
            })

             */
        }
        return {
            name,
            version,
            type: parsed === null || parsed === void 0 ? void 0 : parsed.type,
            raw: parsed === null || parsed === void 0 ? void 0 : parsed.raw,
            semver,
        };
    }
}
exports.parseYarnLockRowV2 = parseYarnLockRowV2;
//# sourceMappingURL=parseYarnLockRowV2.js.map