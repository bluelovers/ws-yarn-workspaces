"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateYarnLockTag = void 0;
const fromContent_1 = require("@yarn-tool/yarnlock-entries/lib/fromContent");
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
const semver_1 = require("semver");
const npm_package_arg_util_1 = require("@yarn-tool/npm-package-arg-util");
const parseSimpleSemVerRange_1 = require("@lazy-node/semver-simple-parse/lib/parseSimpleSemVerRange");
async function updateYarnLockTag(yarnlock_old) {
    const obj = (0, fromContent_1.fromContent)(yarnlock_old);
    yarnlock_old = obj.stringify();
    let report = {};
    await obj.mapAsync(async (data, key) => {
        var _a, _b;
        if (data.value.type === 'tag') {
            let { semver, version, name } = data.value;
            let version_new = await (0, queryVersion_1.queryVersionWithCache)(name, semver);
            if ((version_new === null || version_new === void 0 ? void 0 : version_new.length) && version_new !== version && (0, semver_1.gt)(version_new, version)) {
                obj.del(key);
                (_a = report.removed) !== null && _a !== void 0 ? _a : (report.removed = {});
                report.removed[key] = {
                    from: version,
                    to: version_new,
                };
            }
        }
        else if (data.value.type === 'alias') {
            let npaResult = (0, npm_package_arg_util_1.npa)(data.key);
            //			console.dir({
            //				data,
            //				npaResult,
            //			})
            if (npaResult.rawSpec.startsWith('npm:')) {
                let name = npaResult.subSpec.name;
                let version = data.value.version;
                let semver;
                let version_new;
                if (npaResult.subSpec.type === 'range') {
                    if (npaResult.subSpec.fetchSpec === "" /* EnumSemverVersion.ANY */ || npaResult.subSpec.fetchSpec === "*" /* EnumSemverVersion.STAR */) {
                        semver = '>' + version;
                    }
                    else if ((0, parseSimpleSemVerRange_1.parseSimpleSemVerRange)(npaResult.subSpec.fetchSpec).length > 1) {
                        semver = npaResult.subSpec.fetchSpec;
                    }
                    if (typeof semver === 'string') {
                        version_new = await (0, queryVersion_1.queryVersionWithCache)(name, semver);
                    }
                }
                else if (npaResult.subSpec.type === 'tag') {
                    version_new = await (0, queryVersion_1.queryVersionWithCache)(name, npaResult.subSpec.fetchSpec);
                }
                if ((version_new === null || version_new === void 0 ? void 0 : version_new.length) && version_new !== version && (0, semver_1.gt)(version_new, version)) {
                    obj.del(key);
                    (_b = report.removed) !== null && _b !== void 0 ? _b : (report.removed = {});
                    report.removed[key] = {
                        from: version,
                        to: version_new,
                    };
                }
            }
        }
    });
    let yarnlock_new = obj.stringify();
    return {
        yarnlock_old,
        yarnlock_new,
        yarnlock_changed: yarnlock_old !== yarnlock_new,
        report,
    };
}
exports.updateYarnLockTag = updateYarnLockTag;
//# sourceMappingURL=updateYarnLockTag.js.map