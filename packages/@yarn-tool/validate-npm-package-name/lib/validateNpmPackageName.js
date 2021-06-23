"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateNpmPackageName = void 0;
const validateNpmPackageNameCore_1 = require("./validateNpmPackageNameCore");
const types_1 = require("./types");
function validateNpmPackageName(name, options) {
    var _a;
    if (typeof options !== 'object') {
        options = {
            throwErr: options,
        };
    }
    const ret = (0, validateNpmPackageNameCore_1.validate)(name, options);
    ret.name = name;
    if (!((_a = ret.errors) === null || _a === void 0 ? void 0 : _a.length)) {
        const nameMatch = name.match(types_1.scopedPackagePattern);
        if (nameMatch) {
            ret.scopedPackagePattern = true;
            ret.user = nameMatch[1];
            ret.subname = nameMatch[2];
        }
        else {
            ret.scopedPackagePattern = false;
        }
    }
    else if (options.throwErr) {
        throw new RangeError(ret.errors.concat(ret.warnings || []).join(' ; '));
    }
    return ret;
}
exports.validateNpmPackageName = validateNpmPackageName;
exports.default = validateNpmPackageName;
//# sourceMappingURL=validateNpmPackageName.js.map