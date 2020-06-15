"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChangelog = void 0;
const update_changelog_1 = __importDefault(require("@lerna/conventional-commits/lib/update-changelog"));
const util_1 = require("./util");
const upath2_1 = require("upath2");
function updateChangelog(pkg, options) {
    var _a;
    options = util_1.handleOptions(options);
    let version = (_a = options.version) !== null && _a !== void 0 ? _a : pkg.version;
    options.version = version;
    return update_changelog_1.default({
        ...pkg,
        version,
    }, options.type, options)
        .then((data) => {
        return {
            ...data,
            logPath: upath2_1.normalize(data.logPath),
            version,
        };
    });
}
exports.updateChangelog = updateChangelog;
exports.default = updateChangelog;
//# sourceMappingURL=update.js.map