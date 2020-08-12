"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateYarnLockTag = void 0;
const fromContent_1 = require("@yarn-tool/yarnlock-entries/lib/fromContent");
const queryVersion_1 = require("@yarn-tool/pkg-version-query/lib/queryVersion");
const semver_1 = require("semver");
async function updateYarnLockTag(yarnlock_old) {
    const obj = fromContent_1.fromContent(yarnlock_old);
    yarnlock_old = obj.stringify();
    let report = {};
    await obj.mapAsync(async (data, key) => {
        var _a;
        if (data.value.type === 'tag') {
            let { semver, version, name } = data.value;
            let version_new = await queryVersion_1.queryVersionWithCache(name, semver);
            if ((version_new === null || version_new === void 0 ? void 0 : version_new.length) && version_new !== version && semver_1.gt(version_new, version)) {
                obj.del(key);
                (_a = report.removed) !== null && _a !== void 0 ? _a : (report.removed = {});
                report.removed[key] = {
                    from: version,
                    to: version_new,
                };
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