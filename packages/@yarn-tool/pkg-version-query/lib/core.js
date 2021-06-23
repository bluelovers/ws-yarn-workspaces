"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._queryVersion = void 0;
const tslib_1 = require("tslib");
const package_json_1 = (0, tslib_1.__importDefault)(require("package-json"));
const bluebird_1 = (0, tslib_1.__importDefault)(require("bluebird"));
function _queryVersion(packageName, options) {
    options !== null && options !== void 0 ? options : (options = {});
    return bluebird_1.default.resolve((0, package_json_1.default)(packageName, options))
        .catch(e => {
        if (options.notThrowError) {
            return;
        }
        return Promise.reject(e);
    });
}
exports._queryVersion = _queryVersion;
//# sourceMappingURL=core.js.map