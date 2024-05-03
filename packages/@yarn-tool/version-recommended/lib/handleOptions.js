"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleOptions = handleOptions;
exports.releaseTypesIsPre = releaseTypesIsPre;
exports.detectPreidByVersion = detectPreidByVersion;
const types_1 = require("./types");
const semver_1 = require("semver");
function handleOptions(options, oldVersion) {
    var _a, _b, _c;
    options = {
        ...options,
    };
    let bump = ((_a = options.bump) === null || _a === void 0 ? void 0 : _a.length) ? options.bump : void 0;
    if (!bump) {
        for (let type of types_1.releaseTypes) {
            if (options[type] === true) {
                bump = type;
                break;
            }
        }
    }
    if ((oldVersion === null || oldVersion === void 0 ? void 0 : oldVersion.length) && (!bump || releaseTypesIsPre(bump))) {
        options.bump = bump;
        const dt = detectPreidByVersion(oldVersion, options);
        if (dt) {
            bump = dt.bump;
            (_b = options.preid) !== null && _b !== void 0 ? _b : (options.preid = dt.preid);
            (_c = options.identifierBase) !== null && _c !== void 0 ? _c : (options.identifierBase = dt.identifierBase);
        }
    }
    options.bump = bump;
    /*
    for (let type of releaseTypes)
    {
        delete options[type]
    }
     */
    return options;
}
function releaseTypesIsPre(bump) {
    return bump.startsWith('pre');
}
function detectPreidByVersion(oldVersion, options) {
    var _a;
    if (oldVersion.length) {
        const sv = (0, semver_1.parse)(oldVersion);
        if ((_a = sv.prerelease) === null || _a === void 0 ? void 0 : _a.length) {
            options !== null && options !== void 0 ? options : (options = {});
            let preid = options.preid;
            let identifierBase = options.identifierBase;
            let prerelease = sv.prerelease[0].toString();
            if (sv.prerelease.length > 1) {
                preid !== null && preid !== void 0 ? preid : (preid = prerelease);
            }
            else if (/^\d+$/.test(prerelease)) {
                identifierBase !== null && identifierBase !== void 0 ? identifierBase : (identifierBase = false);
            }
            else {
                preid !== null && preid !== void 0 ? preid : (preid = options.defaultPreid);
            }
            let bump = options.bump;
            if (!(bump === null || bump === void 0 ? void 0 : bump.length)) {
                bump = void 0;
            }
            else if (!releaseTypesIsPre(bump)) {
                bump = 'pre' + bump;
            }
            return {
                bump: (bump !== null && bump !== void 0 ? bump : 'prerelease'),
                preid,
                identifierBase,
            };
        }
    }
    return null;
}
//# sourceMappingURL=handleOptions.js.map