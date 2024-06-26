"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChangelog = updateChangelog;
const update_changelog_1 = require("@lerna/conventional-commits/lib/update-changelog");
const util_1 = require("./util");
const upath2_1 = require("upath2");
function updateChangelog(pkg, options) {
    var _a;
    options = (0, util_1.handleOptions)(options);
    let version = (_a = options.version) !== null && _a !== void 0 ? _a : pkg.version;
    options.version = version;
    return (0, update_changelog_1.updateChangelog)({
        ...pkg,
        version,
    }, options.type, options)
        .then((data) => {
        return {
            ...data,
            logPath: (0, upath2_1.normalize)(data.logPath),
            version,
        };
    });
}
exports.default = updateChangelog;
//# sourceMappingURL=update.js.map