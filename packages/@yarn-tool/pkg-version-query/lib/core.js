"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._queryVersion = void 0;
const package_json_1 = __importDefault(require("package-json"));
const bluebird_1 = __importDefault(require("bluebird"));
function _queryVersion(packageName, options) {
    options !== null && options !== void 0 ? options : (options = {});
    return bluebird_1.default.resolve(package_json_1.default(packageName, options))
        .catch(e => {
        if (options.notThrowError) {
            return;
        }
        return Promise.reject(e);
    });
}
exports._queryVersion = _queryVersion;
//# sourceMappingURL=core.js.map