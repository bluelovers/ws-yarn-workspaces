"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const types_1 = require("./types");
const handleResult_1 = require("./handleResult");
const is_builtin_module_1 = require("@yarn-tool/is-builtin-module");
const defaultBlacklist = [
    'node_modules',
    'favicon.ico',
];
function validate(name, options) {
    var _a;
    const warnings = [];
    const errors = [];
    if (name === null) {
        errors.push('name cannot be null');
        return handleResult_1.handleResult(warnings, errors);
    }
    if (name === undefined) {
        errors.push('name cannot be undefined');
        return handleResult_1.handleResult(warnings, errors);
    }
    if (typeof name !== 'string') {
        errors.push('name must be a string');
        return handleResult_1.handleResult(warnings, errors);
    }
    if (!name.length) {
        errors.push('name length must be greater than zero');
    }
    if (name.match(/^\./)) {
        errors.push('name cannot start with a period');
    }
    if (name.match(/^_/)) {
        errors.push('name cannot start with an underscore');
    }
    if (name.trim() !== name) {
        errors.push('name cannot contain leading or trailing spaces');
    }
    const name_lc = name.toLowerCase();
    const blacklist = (_a = options === null || options === void 0 ? void 0 : options.blacklist) !== null && _a !== void 0 ? _a : defaultBlacklist;
    // No funny business
    blacklist.forEach(function (blacklistedName) {
        if (typeof blacklistedName !== 'string' && blacklistedName.test(name) || typeof blacklistedName === 'string' && name_lc === blacklistedName) {
            errors.push(blacklistedName + ' is a blacklisted name');
        }
    });
    // Generate warnings for stuff that used to be allowed
    // core module names like http, events, util, etc
    if (is_builtin_module_1.createNewIsBuiltinModule(options).isBuiltinModule(name_lc)) {
        warnings.push(name_lc + ' is a core module name');
    }
    // really-long-package-names-------------------------------such--length-----many---wow
    // the thisisareallyreallylongpackagenameitshouldpublishdowenowhavealimittothelengthofpackagenames-poch.
    if (name.length > 214) {
        warnings.push('name can no longer contain more than 214 characters');
    }
    // mIxeD CaSe nAMEs
    if (name_lc !== name) {
        warnings.push('name can no longer contain capital letters');
    }
    if (/[~'!()*]/.test(name.split('/').slice(-1)[0])) {
        warnings.push('name can no longer contain special characters ("~\'!()*")');
    }
    if (encodeURIComponent(name) !== name) {
        // Maybe it's a scoped package name, like @user/package
        const nameMatch = name.match(types_1.scopedPackagePattern);
        if (nameMatch) {
            const user = nameMatch[1];
            const pkg = nameMatch[2];
            if (encodeURIComponent(user) === user && encodeURIComponent(pkg) === pkg) {
                return handleResult_1.handleResult(warnings, errors);
            }
        }
        errors.push('name can only contain URL-friendly characters');
    }
    return handleResult_1.handleResult(warnings, errors);
}
exports.validate = validate;
exports.default = validate;
//# sourceMappingURL=validateNpmPackageNameCore.js.map